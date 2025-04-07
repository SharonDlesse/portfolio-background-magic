
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// You would typically use a more robust solution like OAuth, Firebase Auth, Supabase, etc.
// This is a simplified implementation for demo purposes
type User = {
  username: string;
  isAdmin: boolean;
};

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// For demonstration, using a hardcoded admin credential
// In a real app, use environment variables and a proper auth system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "portfolio123"; // This would be securely stored in a real app
const ADMIN_EMAIL = "admin@example.com"; // Hardcoded for demo purposes
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimer, setSessionTimer] = useState<number | null>(null);

  // Set up automatic session refresh
  useEffect(() => {
    if (user) {
      // Clear any existing timer
      if (sessionTimer) {
        window.clearTimeout(sessionTimer);
      }
      
      // Set a timer to refresh the session every 20 minutes
      const timer = window.setInterval(() => {
        refreshSession();
      }, 20 * 60 * 1000); // 20 minutes
      
      setSessionTimer(timer);
      
      return () => {
        if (sessionTimer) {
          window.clearInterval(sessionTimer);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('portfolioUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const timestamp = localStorage.getItem('portfolioUserTimestamp');
        
        // If there's no timestamp or the session has expired, clear the stored user
        if (!timestamp || Date.now() - Number(timestamp) > SESSION_TIMEOUT) {
          localStorage.removeItem('portfolioUser');
          localStorage.removeItem('portfolioUserTimestamp');
        } else {
          setUser(userData);
          // Update timestamp to extend session
          localStorage.setItem('portfolioUserTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('portfolioUser');
        localStorage.removeItem('portfolioUserTimestamp');
      }
    }
  }, []);

  const refreshSession = () => {
    if (user) {
      // Update timestamp to extend session
      localStorage.setItem('portfolioUserTimestamp', Date.now().toString());
      console.log('Session refreshed at', new Date().toISOString());
    }
  };

  const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
    // In a real app, you would validate credentials against a server
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const newUser = { username, isAdmin: true };
      setUser(newUser);
      
      // Store user data and timestamp
      localStorage.setItem('portfolioUser', JSON.stringify(newUser));
      localStorage.setItem('portfolioUserTimestamp', Date.now().toString());
      
      // If not using rememberMe, also store in sessionStorage as a fallback
      if (!rememberMe) {
        sessionStorage.setItem('portfolioUser', JSON.stringify(newUser));
      } else {
        // Clean up any previous sessionStorage entry
        sessionStorage.removeItem('portfolioUser');
      }
      
      toast.success('Login successful');
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portfolioUser');
    localStorage.removeItem('portfolioUserTimestamp');
    sessionStorage.removeItem('portfolioUser');
    
    if (sessionTimer) {
      window.clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    
    toast.success('Logged out successfully');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // In a real app, this would send a reset email via your backend
    if (email === ADMIN_EMAIL) {
      toast.success('Password reset link sent to your email');
      return true;
    }
    toast.error('Email not found');
    return false;
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
