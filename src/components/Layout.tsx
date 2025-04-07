
import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useBackground } from '@/contexts/BackgroundContext';
import BackgroundSelector from './BackgroundSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentBackground } = useBackground();
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  // Preload image to avoid flickering and improve stability
  useEffect(() => {
    if (currentBackground) {
      const img = new Image();
      img.src = currentBackground;
      img.onload = () => setIsBackgroundLoaded(true);
      img.onerror = () => {
        console.error("Failed to load background image");
        setIsBackgroundLoaded(true); // Continue rendering even if image fails
      };
      
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setIsBackgroundLoaded(true);
    }
  }, [currentBackground]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-500" 
      style={{
        backgroundImage: currentBackground && isBackgroundLoaded ? `url(${currentBackground})` : 'none',
        backgroundColor: currentBackground ? 'transparent' : 'hsl(var(--background))'
      }}
    >
      <div className="min-h-screen bg-black/60 dark:bg-black/80">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="bg-white/95 dark:bg-slate-900/95 p-6 rounded-lg shadow-lg">
            {children}
          </div>
        </main>
        <BackgroundSelector />
      </div>
    </div>
  );
};

export default Layout;
