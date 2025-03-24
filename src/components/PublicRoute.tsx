
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

// This component doesn't restrict access but can be used to customize the view
// based on authentication state for public pages
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Access auth context if needed for conditional rendering
  const { isAuthenticated } = useAuth();

  return <>{children}</>;
};

export default PublicRoute;
