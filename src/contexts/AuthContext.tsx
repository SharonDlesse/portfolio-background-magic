
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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// For demonstration, using a hardcoded admin credential
// In a real app, use environment variables and a proper auth system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "portfolio123"; // This would be securely stored in a real app
const ADMIN_EMAIL = "admin@example.com"; // Hardcoded for demo purposes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('portfolioUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('portfolioUser');
      }
    }
  }, []);

  const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
    // In a real app, you would validate credentials against a server
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const newUser = { username, isAdmin: true };
      setUser(newUser);
      
      // If rememberMe is true, store in localStorage, otherwise use sessionStorage
      if (rememberMe) {
        localStorage.setItem('portfolioUser', JSON.stringify(newUser));
      } else {
        sessionStorage.setItem('portfolioUser', JSON.stringify(newUser));
        // Clean up any previous localStorage entry to avoid conflicts
        localStorage.removeItem('portfolioUser');
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
    sessionStorage.removeItem('portfolioUser');
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
    isAdmin: user?.isAdmin || false
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
