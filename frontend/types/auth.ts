export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';

export interface PortalUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  designation?: string;
  department?: string;
  jurisdiction?: {
    state: string;
    district?: string;
    taluk?: string;
  };
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthSession {
  user: PortalUser | null;
  isAuthenticated: boolean;
  activePortal: UserRole;
}
