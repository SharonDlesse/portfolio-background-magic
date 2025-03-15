
import React, { useEffect } from 'react';
import Header from './Header';
import { useBackground } from '@/contexts/BackgroundContext';
import BackgroundSelector from './BackgroundSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentBackground } = useBackground();
  
  // Preload image to avoid flickering
  useEffect(() => {
    if (currentBackground) {
      const img = new Image();
      img.src = currentBackground;
    }
  }, [currentBackground]);
  
  // Determine if we're using a blob URL (for file uploads)
  const isBlobUrl = currentBackground?.startsWith('blob:');
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-500"
      style={{ 
        backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
      }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-[1px] animate-background-fade">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          {children}
        </main>
        <BackgroundSelector />
      </div>
    </div>
  );
};

export default Layout;
