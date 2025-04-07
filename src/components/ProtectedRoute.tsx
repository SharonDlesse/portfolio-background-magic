
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, refreshSession } = useAuth();
  const location = useLocation();

  // Enhanced session refresh with more aggressive timing
  useEffect(() => {
    if (isAuthenticated) {
      // Immediate refresh when route is accessed
      refreshSession();
      
      // Set up refresh interval for as long as the route is mounted
      const intervalId = setInterval(() => {
        refreshSession();
      }, 60 * 1000); // Every minute
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, refreshSession]);
  
  // Additional refresh on location/route change
  useEffect(() => {
    if (isAuthenticated) {
      refreshSession();
    }
  }, [isAuthenticated, location.pathname, refreshSession]);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if admin access is required but user is not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
