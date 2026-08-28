import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile } from '../types/farmer';
import { initialMockFarmer } from '../data/mockFarmer';

interface AuthContextType {
  user: FarmerProfile | null;
  isAuthenticated: boolean;
  login: (phoneOrEmail: string, name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<FarmerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FarmerProfile | null>(() => {
    const saved = localStorage.getItem('farmer_portal_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialMockFarmer,
          ...parsed,
          notificationPreferences: {
            ...initialMockFarmer.notificationPreferences,
            ...(parsed.notificationPreferences || {}),
          },
        };
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return initialMockFarmer;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('farmer_portal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('farmer_portal_user');
    }
  }, [user]);

  const login = async (phoneOrEmail: string, name?: string): Promise<boolean> => {
    const loggedInFarmer: FarmerProfile = {
      ...initialMockFarmer,
      phone: phoneOrEmail.includes('@') ? initialMockFarmer.phone : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : initialMockFarmer.email,
      name: name || initialMockFarmer.name,
    };
    setUser(loggedInFarmer);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updated: Partial<FarmerProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
