import { Farm } from '../types/farmer';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

export interface BackendFarm {
  id: string;
  userId: string;
  farmName: string;
  area: number;
  location: string;
  lat: number | null;
  lng: number | null;
  crops: Array<{
    id: string;
    farmId: string;
    cropName: string;
    variety: string;
    sowingDate: string;
  }>;
  createdAt: string;
}

function mapFarm(bf: BackendFarm): Farm {
  const firstCrop = bf.crops && bf.crops.length > 0 ? bf.crops[0] : null;
  return {
    id: bf.id,
    farmerId: bf.userId,
    name: bf.farmName,
    plotNumber: bf.location || 'Farm Plot',
    village: bf.location || '',
    taluka: '',
    district: '',
    state: '',
    areaAcres: bf.area || 1,
    irrigationType: 'DRIP',
    crop: {
      name: firstCrop ? firstCrop.cropName : 'Tomato',
      variety: firstCrop ? firstCrop.variety || 'Standard' : 'Standard',
      sowingDate: firstCrop ? firstCrop.sowingDate || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      stage: 'VEGETATIVE',
      health: 'HEALTHY',
      currentRisk: 'LOW',
    },
    totalScansCount: 0,
    lat: bf.lat,
    lng: bf.lng,
    createdAt: bf.createdAt,
  } as Farm;
}

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    try {
      const res = await apiRequest<BackendFarm[]>(ENDPOINTS.FARMS + '/');
      if (res.data && Array.isArray(res.data)) {
        return res.data.map(mapFarm);
      }
    } catch (e) {
      console.warn('Backend /farms failed:', e);
    }
    return [];
  },

  async getFarmById(id: string): Promise<Farm | null> {
    try {
      const res = await apiRequest<BackendFarm>(ENDPOINTS.FARMS + '/' + id);
      if (res.data) return mapFarm(res.data);
    } catch (e) {
      console.warn('Backend /farms/:id failed:', e);
    }
    return null;
  },

  async addFarm(data: {
    farmName: string;
    area?: number;
    location?: string;
    lat?: number;
    lng?: number;
  }): Promise<Farm> {
    const res = await apiRequest<BackendFarm>(ENDPOINTS.FARMS + '/', {
      method: 'POST',
      body: JSON.stringify({
        farmName: data.farmName,
        area: data.area || 1.0,
        location: data.location || '',
        lat: data.lat || null,
        lng: data.lng || null,
      }),
    });

    if (res.data) return mapFarm(res.data);
    throw new Error(res.error || 'Failed to create farm');
  },

  async addCrop(
    farmId: string,
    data: { cropName: string; variety?: string; sowingDate?: string }
  ): Promise<any> {
    const res = await apiRequest<any>(ENDPOINTS.FARMS + '/' + farmId + '/crops', {
      method: 'POST',
      body: JSON.stringify({
        cropName: data.cropName,
        variety: data.variety || '',
        sowingDate: data.sowingDate || '',
      }),
    });
    return res.data;
  },

  async removeCrop(farmId: string, cropId: string): Promise<any> {
    const res = await apiRequest<any>(ENDPOINTS.FARMS + '/' + farmId + '/crops/' + cropId, {
      method: 'DELETE',
    });
    return res.data;
  },

  async deleteFarm(farmId: string): Promise<any> {
    const res = await apiRequest<any>(ENDPOINTS.FARMS + '/' + farmId, {
      method: 'DELETE',
    });
    return res.data;
  },
};
