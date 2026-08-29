'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSession, PortalUser, UserRole } from '@/types';
import { loginUser, LoginPayload } from '@/lib/api/auth';

const STORAGE_KEY = 'krishirakshak_auth_session';

interface AuthContextType {
  session: AuthSession;
  user: PortalUser | null;
  isAuthenticated: boolean;
  activePortal: UserRole;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  logout: () => void;
  switchPortal: (portal: UserRole) => boolean;
  isAuthorizedFor: (role: UserRole) => boolean;
  canSwitchTo: (role: UserRole) => boolean;
}

const DEFAULT_SESSION: AuthSession = {
  user: null,
  isAuthenticated: false,
  activePortal: 'FARMER',
};

function getInitialSession(): AuthSession {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        if (parsed && parsed.isAuthenticated && parsed.user) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session:', e);
    }
  }
  return DEFAULT_SESSION;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>(getInitialSession);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Save session changes to localStorage
  const saveSession = useCallback((newSession: AuthSession) => {
    setSession(newSession);
    try {
      if (typeof window !== 'undefined') {
        if (newSession.isAuthenticated && newSession.user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to save auth session to localStorage:', e);
    }
  }, []);

  // Check if current user is authorized to access a given role/portal
  const isAuthorizedFor = useCallback(
    (targetRole: UserRole): boolean => {
      if (!session.isAuthenticated || !session.user) return false;
      const userRole = session.user.role;

      // Admin has access to all portals
      if (userRole === 'ADMIN') return true;

      // Officer has access to Officer and Farmer
      if (userRole === 'OFFICER') {
        return targetRole === 'OFFICER' || targetRole === 'FARMER';
      }

      // Farmer has access only to Farmer portal
      if (userRole === 'FARMER') {
        return targetRole === 'FARMER';
      }

      return false;
    },
    [session]
  );

  const canSwitchTo = useCallback(
    (targetRole: UserRole): boolean => {
      return isAuthorizedFor(targetRole);
    },
    [isAuthorizedFor]
  );

  // Login handler
  const login = useCallback(
    async (payload: LoginPayload): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
      setIsLoading(true);
      try {
        const response = await loginUser(payload);
        if (response.success && response.user) {
          const newSession: AuthSession = {
            user: response.user,
            isAuthenticated: true,
            activePortal: response.role,
          };
          saveSession(newSession);
          setIsLoading(false);
          return { success: true, role: response.role };
        } else {
          setIsLoading(false);
          return { success: false, error: response.message || 'Login failed' };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Authentication failed. Please verify credentials.';
        return { success: false, error: errorMsg };
      }
    },
    [saveSession]
  );

  // Logout handler
  const logout = useCallback(() => {
    saveSession(DEFAULT_SESSION);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    router.push('/login');
  }, [router, saveSession]);

  // Switch Portal handler
  const switchPortal = useCallback(
    (portal: UserRole): boolean => {
      if (!isAuthorizedFor(portal)) {
        return false;
      }
      const updatedSession: AuthSession = {
        ...session,
        activePortal: portal,
      };
      saveSession(updatedSession);
      router.push(`/${portal.toLowerCase()}`);
      return true;
    },
    [session, isAuthorizedFor, saveSession, router]
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session.user,
        isAuthenticated: session.isAuthenticated,
        activePortal: session.activePortal,
        isLoading,
        login,
        logout,
        switchPortal,
        isAuthorizedFor,
        canSwitchTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
