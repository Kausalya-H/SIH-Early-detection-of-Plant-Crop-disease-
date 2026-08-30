import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, RegisterFullParams } from "../services/authService";

export type UserRole = "FARMER" | "OFFICER" | "ADMIN";

export interface BaseUser {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  token?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: BaseUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  registerFull: (params: RegisterFullParams) => Promise<{ success: boolean; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = "krishi_auth_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BaseUser | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const role: UserRole | null = user?.role || null;
  const isAuthenticated = Boolean(user && user.role);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    if (res.data) {
      setUser({ ...res.data.user, role: "FARMER", token: res.data.token });
      return { success: true };
    }
    return { success: false, error: res.error || "Login failed" };
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authService.register({ name, email, password, phone });
    if (res.data) {
      setUser({ ...res.data.user, role: "FARMER", token: res.data.token });
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  };

  const loginAsRole = (selectedRole: UserRole) => {
    // Quick role switch for demo (officer/admin still mock)
    const mockUsers: Record<string, BaseUser> = {
      OFFICER: { id: "OFF-01", name: "Dr. Rajesh Deshmukh", role: "OFFICER", email: "rajesh@agri.gov.in" },
      ADMIN: { id: "ADMIN-01", name: "Priya Sharma", role: "ADMIN", email: "admin@krishirakshak.gov.in" },
    };
    if (mockUsers[selectedRole]) {
      setUser(mockUsers[selectedRole]);
    }
  };


  const registerFull = async (params: RegisterFullParams) => {
    const res = await authService.registerFull(params);
    if (res.data) {
      setUser({ ...res.data.user, role: "FARMER", token: res.data.token });
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, register, registerFull, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
