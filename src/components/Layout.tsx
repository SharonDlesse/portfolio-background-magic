
import React from 'react';
import Header from './Header';
import { useBackground } from '@/contexts/BackgroundContext';
import BackgroundSelector from './BackgroundSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentBackground } = useBackground();
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${currentBackground})`,
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
