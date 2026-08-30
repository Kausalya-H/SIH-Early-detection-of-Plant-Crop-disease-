import { apiRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export interface Farm {
  _id: string;
  userId: string;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  areaUnit: string;
  soilType?: string;
  irrigation?: string;
  crops: Crop[];
  createdAt: string;
}

export interface Crop {
  _id: string;
  farmId: string;
  userId: string;
  cropName: string;
  variety?: string;
  acreage: number;
  sowingDate?: string;
  season?: string;
  createdAt: string;
}

export const farmService = {
  async getMyFarms(): Promise<{ data: Farm[] | null; error: string | null }> {
    return apiRequest<Farm[]>(ENDPOINTS.FARMS);
  },

  async getFarm(farmId: string): Promise<{ data: Farm | null; error: string | null }> {
    return apiRequest<Farm>(ENDPOINTS.FARM_DETAIL(farmId));
  },

  async createFarm(data: { farmName: string; location: string; latitude: number; longitude: number; area?: number; soilType?: string; irrigation?: string }) {
    return apiRequest<any>(ENDPOINTS.FARMS, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async addCrop(farmId: string, data: { cropName: string; variety?: string; acreage?: number; sowingDate?: string; season?: string }) {
    return apiRequest<any>(ENDPOINTS.FARM_CROPS(farmId), {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async removeCrop(farmId: string, cropId: string) {
    return apiRequest<any>(`${ENDPOINTS.FARM_CROPS(farmId)}/${cropId}`, {
      method: "DELETE",
    });
  },
};
