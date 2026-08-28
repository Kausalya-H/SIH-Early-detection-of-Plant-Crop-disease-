import { FarmerProfile } from '../types/farmer';
import { initialMockFarmer } from '../data/mockFarmer';

const LOCAL_STORAGE_FARMER_KEY = 'farmer_portal_profile';

export const farmerService = {
  async getProfile(): Promise<FarmerProfile> {
    const saved = localStorage.getItem(LOCAL_STORAGE_FARMER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialMockFarmer,
          ...parsed,
          notificationPreferences: {
            ...initialMockFarmer.notificationPreferences,
            ...(parsed.notificationPreferences || {}),
          },
        };
      } catch (e) {
        console.error('Failed to parse farmer profile', e);
      }
    }
    return initialMockFarmer;
  },

  async updateProfile(updates: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const current = await this.getProfile();
    const updated: FarmerProfile = {
      ...current,
      ...updates,
      notificationPreferences: {
        ...current.notificationPreferences,
        ...(updates.notificationPreferences || {}),
      },
    };
    localStorage.setItem(LOCAL_STORAGE_FARMER_KEY, JSON.stringify(updated));
    return updated;
  },
};
