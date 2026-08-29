import { apiClient } from './client';
import { PortalUser, UserRole } from '@/types';

export interface LoginPayload {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
  portal?: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenType?: string;
  role: UserRole;
  activePortal: UserRole;
  user: PortalUser;
}

export interface DemoCredential {
  role: UserRole;
  title: string;
  email: string;
  phone: string;
  password: string;
  name: string;
  description: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'ADMIN',
    title: 'Central Admin & Governance',
    email: 'admin@krishirakshak.gov.in',
    phone: '+91 98100 22345',
    password: 'Admin@123',
    name: 'Dr. Anita Sengupta',
    description: 'Full system oversight, Vision Transformer telemetry, audit logs, and user status controls.',
  },
  {
    role: 'OFFICER',
    title: 'Agriculture Officer Surveillance',
    email: 'officer@krishirakshak.gov.in',
    phone: '+91 98231 44521',
    password: 'Officer@123',
    name: 'Dr. Ramesh K. Patil',
    description: 'Regional epidemiology maps, active outbreak containment, and emergency SMS broadcasts.',
  },
  {
    role: 'FARMER',
    title: 'Kisan / Farmer Portal',
    email: 'farmer@krishirakshak.gov.in',
    phone: '+91 98765 43210',
    password: 'Farmer@123',
    name: 'Rameshwar Rao',
    description: 'Instant AI leaf disease scan, treatment protocols, PDF health reports, and local advisories.',
  },
];

/**
 * Normalizes email or phone string for comparison
 */
function normalizeIdentifier(str: string): string {
  return str.trim().toLowerCase().replace(/[\s-+()]/g, '');
}

/**
 * Fallback local demo credential validator in case backend is offline
 */
export function validateDemoCredentialsLocally(
  identifier: string,
  password: string
): LoginResponse | null {
  const normInput = normalizeIdentifier(identifier);
  const pass = password.trim();

  // 1. Admin
  if (
    (normInput === 'admin' ||
      normInput.includes('admin@krishirakshak.gov.in') ||
      normInput.includes('anita.sengupta') ||
      normInput.includes('vikram.joshi') ||
      normInput.includes('9810022345') ||
      normInput.includes('9920155670')) &&
    pass === 'Admin@123'
  ) {
    return {
      success: true,
      message: 'Demo Admin authentication successful',
      token: 'kr-demo-admin-token-2026',
      role: 'ADMIN',
      activePortal: 'ADMIN',
      user: {
        id: 'usr-admin-001',
        name: 'Dr. Anita Sengupta',
        email: 'admin@krishirakshak.gov.in',
        phone: '+91 98100 22345',
        role: 'ADMIN',
        designation: 'Principal Agricultural Data Scientist',
        department: 'Central AI & Surveillance Directorate',
        jurisdiction: {
          state: 'Delhi (HQ)',
        },
        isActive: true,
      },
    };
  }

  // 2. Officer
  if (
    (normInput === 'officer' ||
      normInput.includes('officer@krishirakshak.gov.in') ||
      normInput.includes('ramesh.patil') ||
      normInput.includes('gurpreet.singh') ||
      normInput.includes('9823144521') ||
      normInput.includes('9417288390')) &&
    pass === 'Officer@123'
  ) {
    return {
      success: true,
      message: 'Demo Officer authentication successful',
      token: 'kr-demo-officer-token-2026',
      role: 'OFFICER',
      activePortal: 'OFFICER',
      user: {
        id: 'usr-officer-002',
        name: 'Dr. Ramesh K. Patil',
        email: 'officer@krishirakshak.gov.in',
        phone: '+91 98231 44521',
        role: 'OFFICER',
        designation: 'District Agriculture Officer (DAO)',
        department: 'Department of Agriculture, Maharashtra',
        jurisdiction: {
          state: 'Maharashtra',
          district: 'Nashik',
          taluk: 'Niphad',
        },
        isActive: true,
      },
    };
  }

  // 3. Farmer
  if (
    (normInput === 'farmer' ||
      normInput === 'kisan' ||
      normInput.includes('farmer@krishirakshak.gov.in') ||
      normInput.includes('kisan@krishirakshak.gov.in') ||
      normInput.includes('9876543210')) &&
    pass === 'Farmer@123'
  ) {
    return {
      success: true,
      message: 'Demo Farmer authentication successful',
      token: 'kr-demo-farmer-token-2026',
      role: 'FARMER',
      activePortal: 'FARMER',
      user: {
        id: 'usr-farmer-003',
        name: 'Rameshwar Rao',
        email: 'farmer@krishirakshak.gov.in',
        phone: '+91 98765 43210',
        role: 'FARMER',
        designation: 'Progressive Kisan Member',
        department: 'Nashik Agro-Cluster Cooperative',
        jurisdiction: {
          state: 'Maharashtra',
          district: 'Nashik',
          taluk: 'Pimpalgaon',
        },
        isActive: true,
      },
    };
  }

  return null;
}

/**
 * Authenticates user against backend /auth/login with seamless client-side demo fallback.
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const identifier = payload.email || payload.phone || payload.username || '';

  try {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email || identifier,
        phone: payload.phone || identifier,
        username: payload.username || identifier,
        password: payload.password,
        portal: payload.portal,
      }),
      timeoutMs: 4000,
    });
    return response;
  } catch (error) {
    // If backend is unavailable or times out, check demo credentials locally
    const localMatch = validateDemoCredentialsLocally(identifier, payload.password);
    if (localMatch) {
      return localMatch;
    }
    throw error;
  }
}
