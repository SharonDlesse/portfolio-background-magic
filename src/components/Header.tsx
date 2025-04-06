
import React, { useState, useEffect } from 'react';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import AdminLink from './AdminLink';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const ListItem = React.forwardRef<
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

  const MobileMenu = () => (
    <div className="fixed inset-0 bg-white/95 dark:bg-black/95 z-50 flex flex-col pt-16 pb-8 px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4" 
        onClick={() => setIsMenuOpen(false)}
      >
        <X className="h-6 w-6" />
      </Button>
      
      <nav className="flex flex-col gap-2">
        <Link 
          to="/" 
          className={`px-3 py-2 text-lg ${location.pathname === '/' ? 'font-bold' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          to="/projects" 
          className={`px-3 py-2 text-lg ${location.pathname === '/projects' ? 'font-bold' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Projects
        </Link>
        <Link 
          to="/about" 
          className={`px-3 py-2 text-lg ${location.pathname === '/about' ? 'font-bold' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`px-3 py-2 text-lg ${location.pathname === '/contact' ? 'font-bold' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
      </nav>
      
      <div className="mt-auto">
        <AdminLink to="/admin/dashboard" icon="home">
          Admin
        </AdminLink>
      </div>
    </div>
  );

  return (
    <header className="fixed w-full top-0 z-40 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo/Brand */}
        <Link to="/" className="text-xl font-bold font-serif">
          Portfolio
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile ? (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                    <Link to="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                    <Link to="/projects">Projects</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-black dark:text-white">About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 no-underline outline-none focus:shadow-md"
                          href="/about"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-black dark:text-white">
                            About Me
                          </div>
                          <p className="text-sm leading-tight text-gray-500 dark:text-gray-400">
                            Learn more about my background, skills, and experience.
                          </p>
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black dark:hover:bg-gray-800 dark:hover:text-white dark:focus:bg-gray-800 dark:focus:text-white">
                          <div className="text-sm font-medium leading-none">My Story</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            The journey that brought me to where I am today.
                          </p>
                        </a>
                      </li>
                      <li>
                        <a href="/about#skills" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black dark:hover:bg-gray-800 dark:hover:text-white dark:focus:bg-gray-800 dark:focus:text-white">
                          <div className="text-sm font-medium leading-none">Skills & Expertise</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Technical and creative abilities that define my work.
                          </p>
                        </a>
                      </li>
                      <li>
                        <a href="/about#experience" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black dark:hover:bg-gray-800 dark:hover:text-white dark:focus:bg-gray-800 dark:focus:text-white">
                          <div className="text-sm font-medium leading-none">Experience</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Professional history and key achievements.
                          </p>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-black dark:text-white")}>
                    <Link to="/contact">Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <AdminLink to="/admin/dashboard" icon="home">
              Admin
            </AdminLink>
          </div>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            {isMenuOpen && <MobileMenu />}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
