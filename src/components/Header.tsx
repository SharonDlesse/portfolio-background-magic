
import React, { useState, useEffect } from 'react';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import AdminLink from './AdminLink';

const Header: React.FC = () => {
  const isMobile = useMobile();
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
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  const MobileMenu = () => (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col pt-16 pb-8 px-6">
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
        <AdminLink />
      </div>
    </div>
  );

  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo/Brand */}
        <Link to="/" className="text-xl font-bold">
          Portfolio
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile ? (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/projects">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Projects
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/about"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              About Me
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Learn more about my background, skills, and experience.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/about" title="My Story">
                        The journey that brought me to where I am today.
                      </ListItem>
                      <ListItem href="/about#skills" title="Skills & Expertise">
                        Technical and creative abilities that define my work.
                      </ListItem>
                      <ListItem href="/about#experience" title="Experience">
                        Professional history and key achievements.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <AdminLink />
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
