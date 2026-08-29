import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile } from '../types/farmer';
import { initialMockFarmer } from '../data/mockFarmer';
import { farmerService } from '../services/farmerService';

export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';

export interface BaseUser {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  designation?: string;
  jurisdiction?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  [key: string]: any;
}

export type AuthUser = (FarmerProfile & BaseUser) | BaseUser;

interface LoginCredentials {
  phone?: string;
  email?: string;
  name?: string;
  officerId?: string;
  adminId?: string;
  password?: string;
  otp?: string;
  jurisdiction?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole, credentials?: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<AuthUser>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'krishi_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved auth session', e);
      }
    }
    // No default auto-login so root "/" displays the common login gateway
    return null;
  });

  const role: UserRole | null = user?.role || null;
  const isAuthenticated = Boolean(user && user.role);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      // Also maintain backward-compatibility with farmer_portal_user key
      if (user.role === 'FARMER') {
        localStorage.setItem('farmer_portal_user', JSON.stringify(user));
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('farmer_portal_user');
    }
  }, [user]);

  const login = async (selectedRole: UserRole, credentials: LoginCredentials = {}): Promise<boolean> => {
    if (selectedRole === 'FARMER') {
      const farmerData: FarmerProfile & BaseUser = {
        ...initialMockFarmer,
        id: credentials.phone ? `MH-${credentials.phone.slice(-6)}` : initialMockFarmer.id,
        name: credentials.name || initialMockFarmer.name,
        phone: credentials.phone || initialMockFarmer.phone,
        email: credentials.email || initialMockFarmer.email,
        role: 'FARMER',
        designation: 'Progressive Farmer / Cultivator',
        jurisdiction: `${initialMockFarmer.village}, ${initialMockFarmer.district}`,
      };

      try {
        const saved = await farmerService.updateProfile(farmerData);
        setUser({ ...farmerData, ...saved, role: 'FARMER' });
      } catch {
        setUser(farmerData);
      }
      return true;
    }

    if (selectedRole === 'OFFICER') {
      const officerUser: BaseUser = {
        id: credentials.officerId || 'OFF-PUNE-7402',
        name: credentials.name || 'Dr. Rajesh Deshmukh',
        role: 'OFFICER',
        email: credentials.email || 'rajesh.deshmukh@agri.gov.in',
        phone: credentials.phone || '+91 94220 88123',
        designation: 'District Agriculture Officer (DAO)',
        jurisdiction: credentials.jurisdiction || 'Pune Division & Baramati Sub-Division, Maharashtra',
        state: 'Maharashtra',
        district: 'Pune',
      };
      setUser(officerUser);
      return true;
    }

    if (selectedRole === 'ADMIN') {
      const adminUser: BaseUser = {
        id: credentials.adminId || 'ADMIN-CENTRAL-01',
        name: credentials.name || 'Priya Sharma',
        role: 'ADMIN',
        email: credentials.email || 'admin@krishirakshak.gov.in',
        phone: credentials.phone || '+91 91100 22001',
        designation: 'Senior Agricultural AI Governance Lead',
        jurisdiction: 'National Central AI Node, New Delhi (ICAR-NIC)',
        state: 'Delhi',
        district: 'New Delhi',
      };
      setUser(adminUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updated: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updated } as AuthUser;
    if (updatedUser.role === 'FARMER') {
      try {
        const saved = await farmerService.updateProfile(updatedUser as FarmerProfile);
        setUser({ ...updatedUser, ...saved });
        return;
      } catch (err) {
        console.warn('Backend updateProfile notice:', err);
      }
    }
    setUser(updatedUser);
  };

  const refreshProfile = async () => {
    if (user?.role === 'FARMER') {
      const latest = await farmerService.getProfile();
      setUser({ ...user, ...latest, role: 'FARMER' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
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
