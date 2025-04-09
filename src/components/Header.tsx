
import React, { useState, useEffect, memo } from 'react';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  navigationMenuTriggerStyle,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Menu, X, Zap, Eye } from 'lucide-react';
import AdminLink from './AdminLink';

const ListItem = memo(React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black dark:hover:bg-gray-800 dark:hover:text-white dark:focus:bg-gray-800 dark:focus:text-white",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
          {children}
        </p>
      </a>
    </li>
  );
});
ListItem.displayName = "ListItem";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  // Typo was likely here, adding the missing parenthesis
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Navigation error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          Navigation error. Please <button 
            onClick={() => this.setState({ hasError: false })}
            className="underline"
          >
            try again
          </button>.
        </div>
      );
    }

    return this.props.children;
  }
}

const MobileMenu: React.FC<{ onClose: () => void }> = memo(({ onClose }) => {
  const location = useLocation();
  
  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-black/95 z-50 flex flex-col pt-16 pb-8 px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4" 
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      <nav className="flex flex-col gap-2">
        <Link 
          to="/" 
          className={`px-3 py-2 text-lg ${location.pathname === '/' ? 'font-bold' : ''}`}
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          to="/projects" 
          className={`px-3 py-2 text-lg ${location.pathname === '/projects' ? 'font-bold' : ''}`}
          onClick={onClose}
        >
          Projects
        </Link>
        <Link 
          to="/about" 
          className={`px-3 py-2 text-lg ${location.pathname === '/about' ? 'font-bold' : ''}`}
          onClick={onClose}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`px-3 py-2 text-lg ${location.pathname === '/contact' ? 'font-bold' : ''}`}
          onClick={onClose}
        >
          Contact
        </Link>
        <Link 
          to="/diagnostics" 
          className={`px-3 py-2 text-lg flex items-center gap-2 ${location.pathname === '/diagnostics' ? 'font-bold text-blue-600' : ''}`}
          onClick={onClose}
        >
          <Zap className="h-4 w-4" />
          Diagnostics
        </Link>
        
        <a 
          href={window.location.pathname}
          target="_blank" 
          rel="noopener noreferrer"
          className="px-3 py-2 text-lg flex items-center gap-2 text-green-600"
          onClick={onClose}
        >
          <Eye className="h-4 w-4" />
          Preview Current Page
        </a>
      </nav>
      
      <div className="mt-auto">
        <AdminLink to="/admin/dashboard" icon="home">
          Admin
        </AdminLink>
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed w-full top-0 z-40 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold font-serif">
          Portfolio
        </Link>
        
        {!isMobile ? (
          <ErrorBoundary>
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/" className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/projects" className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                      Projects
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-black dark:text-white">About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <Link
                            to="/about"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-black dark:text-white">
                              About Me
                            </div>
                            <p className="text-sm leading-tight text-gray-500 dark:text-gray-400">
                              Learn more about my background, skills, and experience.
                            </p>
                          </Link>
                        </li>
                        <ListItem title="My Story">
                          The journey that brought me to where I am today.
                        </ListItem>
                        <ListItem title="Skills & Expertise">
                          Technical and creative abilities that define my work.
                        </ListItem>
                        <ListItem title="Experience">
                          Professional history and key achievements.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/contact" className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                      Contact
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link 
                      to="/diagnostics" 
                      className={cn(navigationMenuTriggerStyle(), "text-blue-600 dark:text-blue-500 flex items-center gap-1")}
                    >
                      <Zap className="h-4 w-4" />
                      Diagnostics
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <a 
                      href={window.location.pathname}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(navigationMenuTriggerStyle(), "text-green-600 dark:text-green-500 flex items-center gap-1")}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </a>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <AdminLink to="/admin/dashboard" icon="home">
                Admin
              </AdminLink>
            </div>
          </ErrorBoundary>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
          </>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
