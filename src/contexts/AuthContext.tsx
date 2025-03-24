
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// For demonstration, using a hardcoded admin credential
// In a real app, use environment variables and a proper auth system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "portfolio123"; // This would be securely stored in a real app

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

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials against a server
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const newUser = { username, isAdmin: true };
      setUser(newUser);
      localStorage.setItem('portfolioUser', JSON.stringify(newUser));
      toast.success('Login successful');
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portfolioUser');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
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
