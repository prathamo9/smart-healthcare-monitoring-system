import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle();
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.loginWithEmail(email);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.loginAsGuest();
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        loginAsGuest,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
