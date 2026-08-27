import { FarmerProfile } from '../types/farmer';
import { initialMockFarmer } from '../data/mockFarmer';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const farmerService = {
  async getProfile(): Promise<FarmerProfile> {
    if (!USE_MOCK_DATA) {
      const res = await apiRequest<FarmerProfile>(ENDPOINTS.FARMER_PROFILE);
      if (res.data) return res.data;
    }
    // Return local mock
    const saved = localStorage.getItem('farmer_portal_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached farmer profile', e);
      }
    }
    return initialMockFarmer;
  },

  async updateProfile(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    if (!USE_MOCK_DATA) {
      const res = await apiRequest<FarmerProfile>(ENDPOINTS.FARMERS, {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (res.data) return res.data;
    }
    // Update local storage
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('farmer_portal_user', JSON.stringify(updated));
    return updated;
  }
};
