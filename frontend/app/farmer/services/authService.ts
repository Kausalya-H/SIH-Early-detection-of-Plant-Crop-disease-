import { apiRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}


export interface FarmInput {
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  area?: number;
  areaUnit?: string;
}

export interface CropInput {
  cropName: string;
  variety?: string;
  acreage?: number;
  sowingDate?: string;
  season?: string;
}

export interface RegisterFullParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
  farm?: FarmInput;
  crops?: CropInput[];
}

export interface RegisterFullResponse {
  message: string;
  token: string;
  user: AuthResponse["user"];
  farmId?: string;
}
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    language?: string;
  };
}

export const authService = {
  async register(params: RegisterParams): Promise<{ data: AuthResponse | null; error: string | null }> {
    return apiRequest<AuthResponse>(ENDPOINTS.AUTH_REGISTER, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async login(params: LoginParams): Promise<{ data: AuthResponse | null; error: string | null }> {
    return apiRequest<AuthResponse>(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },


  async registerFull(params: RegisterFullParams): Promise<{ data: RegisterFullResponse | null; error: string | null }> {
    return apiRequest<RegisterFullResponse>(ENDPOINTS.AUTH_REGISTER_FULL, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
  async getMe(): Promise<{ data: any | null; error: string | null }> {
    return apiRequest<any>(ENDPOINTS.AUTH_ME);
  },
};
