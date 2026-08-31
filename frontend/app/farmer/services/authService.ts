import { apiRequest, setAuthToken, clearAuthToken } from './apiClient';
import { ENDPOINTS } from './apiConfig';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface RegisterFullParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  language?: string;
  placeName?: string;
  lat?: number;
  lng?: number;
  farmName?: string;
  farmArea?: number;
  cropNames?: string[];
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
    const res = await apiRequest<{ message: string; token: string; user: AuthUser }>(
      ENDPOINTS.AUTH_REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (res.data) {
      setAuthToken(res.data.token);
      return { user: res.data.user, token: res.data.token, error: null };
    }
    return { user: null, token: null, error: res.error || 'Registration failed' };
  },

  async login(
    email: string,
    password: string
  ): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
    const res = await apiRequest<{ message: string; token: string; user: AuthUser }>(
      ENDPOINTS.AUTH_LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (res.data) {
      setAuthToken(res.data.token);
      return { user: res.data.user, token: res.data.token, error: null };
    }
    return { user: null, token: null, error: res.error || 'Login failed' };
  },

  async getMe(): Promise<{ user: AuthUser | null; error: string | null }> {
    const res = await apiRequest<AuthUser>(ENDPOINTS.AUTH_ME);
    if (res.data) {
      return { user: res.data, error: null };
    }
    return { user: null, error: res.error || 'Failed to fetch profile' };
  },

  async registerFull(
    data: RegisterFullParams
  ): Promise<{ user: AuthUser | null; token: string | null; error: string | null }> {
    const res = await apiRequest<{ message: string; token: string; user: AuthUser }>(
      ENDPOINTS.AUTH_REGISTER_FULL,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (res.data) {
      setAuthToken(res.data.token);
      return { user: res.data.user, token: res.data.token, error: null };
    }
    return { user: null, token: null, error: res.error || 'Registration failed' };
  },

  logout() {
    clearAuthToken();
  },
};
