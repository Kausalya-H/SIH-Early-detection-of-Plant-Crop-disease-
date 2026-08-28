import { Farm } from '../types/farmer';
import { mockFarms } from '../data/mockFarms';

const LOCAL_STORAGE_FARMS_KEY = 'farmer_portal_farms_v2';

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_FARMS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse farms', e);
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
    const updated = [newFarm, ...farms];
    localStorage.setItem(LOCAL_STORAGE_FARMS_KEY, JSON.stringify(updated));
    return newFarm;
  },
};
