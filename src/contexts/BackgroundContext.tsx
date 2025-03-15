
import React, { createContext, useContext, useState, useEffect } from 'react';

export type BackgroundImage = {
  id: string;
  name: string;
  url: string;
  isPreset: boolean;
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
  { id: 'preset-1', name: 'Mountain Valley', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', isPreset: true },
  { id: 'preset-2', name: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', isPreset: true },
  { id: 'preset-3', name: 'Night Sky', url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e', isPreset: true },
  { id: 'preset-4', name: 'Forest Path', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b', isPreset: true },
  { id: 'preset-5', name: 'Urban City', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df', isPreset: true },
];

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<string>('');
  const [savedBackgrounds, setSavedBackgrounds] = useState<BackgroundImage[]>([...presetBackgrounds]);
  
  // Load saved background from localStorage on initial render
  useEffect(() => {
    const savedBg = localStorage.getItem('portfolioBackground');
    if (savedBg) {
      setCurrentBackground(savedBg);
    } else {
      // Default to first preset if nothing saved
      setCurrentBackground(presetBackgrounds[0].url);
    }
    
    // Load custom backgrounds
    const customBgs = localStorage.getItem('customBackgrounds');
    if (customBgs) {
      const parsedCustomBgs = JSON.parse(customBgs) as BackgroundImage[];
      setSavedBackgrounds([...presetBackgrounds, ...parsedCustomBgs]);
    }
  }, []);
  
  // Save current background to localStorage whenever it changes
  useEffect(() => {
    if (currentBackground) {
      localStorage.setItem('portfolioBackground', currentBackground);
    }
  }, [currentBackground]);
  
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
  
  const uploadBackground = (file: File, name: string) => {
    // Create a blob URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    
    const newBackground: BackgroundImage = {
      id: `custom-${Date.now()}`,
      name: name || file.name,
      url: fileUrl,
      isPreset: false
    };
    
    addBackground(newBackground);
    return fileUrl;
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
