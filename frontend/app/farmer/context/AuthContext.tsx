import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';
import { getAuthToken } from '../services/apiClient';

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

export type AuthUserType = BaseUser;

interface LoginCredentials {
  phone?: string;
  email?: string;
  name?: string;
  password?: string;
  officerId?: string;
  adminId?: string;
  otp?: string;
  jurisdiction?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUserType | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole, credentials?: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<AuthUserType>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'krishi_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserType | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      } catch (e) {
        console.error('Failed to parse saved auth session', e);
      }
    }
    return null;
  });

  const role: UserRole | null = user?.role || null;
  const isAuthenticated = Boolean(user && user.role);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Restore session from JWT on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      authService.getMe().then(({ user: me, error }) => {
        if (me && !error) {
          setUser({ ...me, role: me.role as UserRole } as AuthUserType);
        }
      });
    }
  }, []);

  const login = async (selectedRole: UserRole, credentials: LoginCredentials = {}): Promise<boolean> => {
    if (selectedRole === 'FARMER') {
      if (credentials.email && credentials.password) {
        // Try login first
        let { user: authUser, error } = await authService.login(credentials.email, credentials.password);

        // If login fails, auto-register
        if (!authUser && error) {
          console.log('User not found, auto-registering...');
          const regResult = await authService.register({
            name: credentials.name || 'Farmer',
            email: credentials.email,
            password: credentials.password,
            phone: credentials.phone,
          });
          if (regResult.user) {
            authUser = regResult.user;
            error = null;
          }
        }

        if (authUser && !error) {
          setUser({ ...authUser, role: 'FARMER' } as AuthUserType);
          return true;
        }
        console.warn('Backend auth failed:', error);
        return false;
      }

      // Phone-based fallback: auto-register with phone as email
      if (credentials.phone) {
        const tempEmail = `${credentials.phone}@farmer.krishirakshak`;
        const tempPass = 'farmer123';
        let { user: authUser } = await authService.login(tempEmail, tempPass);
        if (!authUser) {
          await authService.register({
            name: credentials.name || 'Farmer',
            email: tempEmail,
            password: tempPass,
            phone: credentials.phone,
          });
          ({ user: authUser } = await authService.login(tempEmail, tempPass));
        }
        if (authUser) {
          setUser({ ...authUser, role: 'FARMER' } as AuthUserType);
          return true;
        }
        return false;
      }

      // Demo fallback (no backend)
      const farmerUser: AuthUserType = {
        id: 'demo-farmer',
        name: credentials.name || 'Ramesh Patil',
        role: 'FARMER',
        phone: credentials.phone || '+91 98220 14321',
        email: 'demo@farmer.krishirakshak',
      };
      setUser(farmerUser);
      return true;
    }

    if (selectedRole === 'OFFICER') {
      setUser({
        id: credentials.officerId || 'OFF-PUNE-7402',
        name: credentials.name || 'Dr. Rajesh Deshmukh',
        role: 'OFFICER',
        email: 'rajesh.deshmukh@agri.gov.in',
        phone: '+91 94220 88123',
        designation: 'District Agriculture Officer (DAO)',
        jurisdiction: credentials.jurisdiction || 'Pune Division & Baramati Sub-Division',
        state: 'Maharashtra',
        district: 'Pune',
      } as AuthUserType);
      return true;
    }

    if (selectedRole === 'ADMIN') {
      setUser({
        id: credentials.adminId || 'ADMIN-CENTRAL-01',
        name: credentials.name || 'Priya Sharma',
        role: 'ADMIN',
        email: 'admin@krishirakshak.gov.in',
        designation: 'Senior Agricultural AI Governance Lead',
        jurisdiction: 'National Central AI Node, New Delhi',
        state: 'Delhi',
        district: 'New Delhi',
      } as AuthUserType);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const updateProfile = async (updated: Partial<AuthUserType>) => {
    if (!user) return;
    setUser({ ...user, ...updated } as AuthUserType);
  };

  const refreshProfile = async () => {
    const { user: me, error } = await authService.getMe();
    if (me && !error) {
      setUser({ ...me, role: me.role as UserRole } as AuthUserType);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
