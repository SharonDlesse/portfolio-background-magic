import React, { createContext, useContext, useState, useEffect } from 'react';

export type BackgroundImage = {
  id: string;
  name: string;
  url: string;
  isPreset: boolean;
  base64Data?: string; // Add this to store base64 representation of uploaded images
};

interface BackgroundContextProps {
  currentBackground: string;
  setCurrentBackground: (url: string) => void;
  savedBackgrounds: BackgroundImage[];
  addBackground: (background: BackgroundImage) => void;
  uploadBackground: (file: File, name: string) => void;
  removeBackground: (id: string) => void;
}

const BackgroundContext = createContext<BackgroundContextProps | undefined>(undefined);

// Preset backgrounds
const presetBackgrounds: BackgroundImage[] = [
  { id: 'preset-1', name: 'Mountain Valley', url: '', isPreset: true },
  { id: 'preset-2', name: 'Ocean Waves', url: '', isPreset: true },
  { id: 'preset-3', name: 'Night Sky', url: '', isPreset: true },
  { id: 'preset-4', name: 'Forest Path', url: '', isPreset: true },
  { id: 'preset-5', name: 'Urban City', url: '', isPreset: true },
];

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert base64 back to blob URL
const base64ToUrl = (base64: string): string => {
  // Extract the mime type and data
  const [, mimeType, base64Data] = base64.match(/^data:([^;]+);base64,(.+)$/) || [];
  
  if (!base64Data) return '';
  
  // Decode the base64 string
  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create a blob from the bytes
  const blob = new Blob([bytes], { type: mimeType });
  
  // Return as object URL
  return URL.createObjectURL(blob);
};

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<string>('');
  const [savedBackgrounds, setSavedBackgrounds] = useState<BackgroundImage[]>([...presetBackgrounds]);
  
  // Load saved background and custom backgrounds from localStorage on initial render
  useEffect(() => {
    const savedBg = localStorage.getItem('portfolioBackground');
    if (savedBg) {
      // Check if it's a stored base64 background
      if (savedBg.startsWith('data:')) {
        const blobUrl = base64ToUrl(savedBg);
        setCurrentBackground(blobUrl);
      } else {
        setCurrentBackground(savedBg);
      }
    } else {
      // Default to first preset if nothing saved
      setCurrentBackground(presetBackgrounds[0].url);
    }
    
    // Load custom backgrounds
    const customBgs = localStorage.getItem('customBackgrounds');
    if (customBgs) {
      try {
        const parsedCustomBgs = JSON.parse(customBgs) as BackgroundImage[];
        // Convert stored base64 data back to blob URLs for custom backgrounds
        const processedBackgrounds = parsedCustomBgs.map(bg => {
          if (bg.base64Data) {
            return {
              ...bg,
              url: base64ToUrl(bg.base64Data)
            };
          }
          return bg;
        });
        
        setSavedBackgrounds([...presetBackgrounds, ...processedBackgrounds]);
      } catch (error) {
        console.error('Error parsing custom backgrounds:', error);
        setSavedBackgrounds([...presetBackgrounds]);
      }
    }
    
    // Cleanup function to revoke any blob URLs when unmounting
    return () => {
      savedBackgrounds.forEach(bg => {
        if (bg.url.startsWith('blob:') && !bg.base64Data) {
          URL.revokeObjectURL(bg.url);
        }
      });
    };
  }, []);
  
  // Save current background to localStorage whenever it changes
  useEffect(() => {
    if (currentBackground) {
      // If it's a blob URL, find the corresponding background to get its base64 data
      if (currentBackground.startsWith('blob:')) {
        const bg = savedBackgrounds.find(b => b.url === currentBackground);
        if (bg && bg.base64Data) {
          localStorage.setItem('portfolioBackground', bg.base64Data);
        }
      } else {
        localStorage.setItem('portfolioBackground', currentBackground);
      }
    }
  }, [currentBackground, savedBackgrounds]);
  
  // Save custom backgrounds to localStorage
  const saveCustomBackgrounds = (backgrounds: BackgroundImage[]) => {
    const customBgs = backgrounds.filter(bg => !bg.isPreset);
    localStorage.setItem('customBackgrounds', JSON.stringify(customBgs));
  };
  
  const addBackground = (background: BackgroundImage) => {
    // Check if URL already exists
    if (savedBackgrounds.some(bg => bg.url === background.url)) {
      return;
    }
    
    const newBackgrounds = [...savedBackgrounds, background];
    setSavedBackgrounds(newBackgrounds);
    saveCustomBackgrounds(newBackgrounds);
  };
  
  const uploadBackground = async (file: File, name: string) => {
    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);
      
      // Create a blob URL for immediate display
      const fileUrl = URL.createObjectURL(file);
      
      const newBackground: BackgroundImage = {
        id: `custom-${Date.now()}`,
        name: name || file.name,
        url: fileUrl,
        isPreset: false,
        base64Data: base64Data
      };
      
      addBackground(newBackground);
      return fileUrl;
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      return '';
    }
  };
  
  const removeBackground = (id: string) => {
    // Don't allow removing presets
    if (id.startsWith('preset-')) {
      return;
    }
    
    const backgroundToRemove = savedBackgrounds.find(bg => bg.id === id);
    
    // If it's a blob URL, revoke it to free up memory
    if (backgroundToRemove && backgroundToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(backgroundToRemove.url);
    }
    
    const newBackgrounds = savedBackgrounds.filter(bg => bg.id !== id);
    setSavedBackgrounds(newBackgrounds);
    saveCustomBackgrounds(newBackgrounds);
    
    // If current background was removed, switch to first preset
    if (backgroundToRemove && currentBackground === backgroundToRemove.url) {
      setCurrentBackground(presetBackgrounds[0].url);
    }
  };
  
  return (
    <BackgroundContext.Provider 
      value={{ 
        currentBackground, 
        setCurrentBackground, 
        savedBackgrounds, 
        addBackground,
        uploadBackground, 
        removeBackground 
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

export { fileToBase64, base64ToUrl };
