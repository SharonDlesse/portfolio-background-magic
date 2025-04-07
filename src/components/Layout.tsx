import React, { useEffect } from 'react';
import Header from './Header';
import { useBackground } from '@/contexts/BackgroundContext';
import BackgroundSelector from './BackgroundSelector';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const {
    currentBackground
  } = useBackground();

  // Preload image to avoid flickering
  useEffect(() => {
    if (currentBackground) {
      const img = new Image();
      img.src = currentBackground;
    }
  }, [currentBackground]);
  return <div className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-500" style={{
    backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
    backgroundColor: currentBackground ? 'transparent' : 'hsl(var(--background))'
  }}>
      <div className="min-h-screen bg-black/5 dark:bg-black/20 backdrop-blur-[0.5px]">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 bg-zinc-950">
          {children}
        </main>
        <BackgroundSelector />
      </div>
    </div>;
};
export default Layout;