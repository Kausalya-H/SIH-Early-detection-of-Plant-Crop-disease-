import { Farm } from '../types/farmer';
import { mockFarms } from '../data/mockFarms';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

const LOCAL_STORAGE_FARMS_KEY = 'farmer_portal_farms';

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    if (!USE_MOCK_DATA) {
      const res = await apiRequest<Farm[]>(ENDPOINTS.FARMS);
      if (res.data) return res.data;
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_FARMS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached farms', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_FARMS_KEY, JSON.stringify(mockFarms));
    return mockFarms;
  },

  async getFarmById(id: string): Promise<Farm | null> {
    const farms = await this.getFarms();
    return farms.find((f) => f.id === id) || null;
  },

  async addFarm(farmData: Omit<Farm, 'id' | 'createdAt' | 'totalScansCount'>): Promise<Farm> {
    const farms = await this.getFarms();
    const newFarm: Farm = {
      ...farmData,
      id: `farm_${Date.now()}`,
      totalScansCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedFarms = [newFarm, ...farms];
    localStorage.setItem(LOCAL_STORAGE_FARMS_KEY, JSON.stringify(updatedFarms));
    return newFarm;
  },

  async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm | null> {
    const farms = await this.getFarms();
    const index = farms.findIndex((f) => f.id === id);
    if (index === -1) return null;

    farms[index] = { ...farms[index], ...updates };
    localStorage.setItem(LOCAL_STORAGE_FARMS_KEY, JSON.stringify(farms));
    return farms[index];
  }
};
