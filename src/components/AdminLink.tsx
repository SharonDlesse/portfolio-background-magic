
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Settings,
  ImageIcon  // Added for Images page
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: "home" | "projects" | "settings" | "images"; // Added images
}

const AdminLink: React.FC<AdminLinkProps> = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  let IconComponent;
  switch (icon) {
    case 'home':
      IconComponent = Home;
      break;
    case 'projects':
      IconComponent = LayoutGrid;
      break;
    case 'settings':
      IconComponent = Settings;
      break;
    case 'images':
      IconComponent = ImageIcon;
      break;
    default:
      IconComponent = null;
  }

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {IconComponent && <IconComponent className="h-4 w-4" />}
      {children}
    </Link>
  );
};

export default AdminLink;
