import { FarmerProfile } from '../types/farmer';
import { initialMockFarmer } from '../data/mockFarmer';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

const LOCAL_STORAGE_FARMER_KEY = 'farmer_portal_profile';

export interface BackendFarmer {
  _id?: string;
  name: string;
  phone: string;
  language: string;
  location: string;
  crop: string;
}

export const farmerService = {
  /**
   * Check backend server health status
   */
  async checkHealth(): Promise<{ online: boolean; status: string }> {
    const res = await apiRequest<{ status: string }>(ENDPOINTS.HEALTH);
    if (res.data && res.data.status === 'healthy') {
      return { online: true, status: res.data.status };
    }
    return { online: false, status: res.error || 'offline' };
  },

  /**
   * Retrieve farmer profile from backend or localStorage cache
   */
  async getProfile(): Promise<FarmerProfile> {
    // 1. Try to fetch from backend GET /farmers/
    try {
      const res = await apiRequest<BackendFarmer[]>(ENDPOINTS.FARMERS);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const latestBackendFarmer = res.data[res.data.length - 1];
        const saved = localStorage.getItem(LOCAL_STORAGE_FARMER_KEY);
        const parsedSaved = saved ? JSON.parse(saved) : {};

        const locationParts = (latestBackendFarmer.location || '').split(',');
        const village = locationParts[0]?.trim() || parsedSaved.village || initialMockFarmer.village;
        const taluka = locationParts[1]?.trim() || parsedSaved.taluka || initialMockFarmer.taluka;
        const district = locationParts[2]?.trim() || parsedSaved.district || initialMockFarmer.district;

        return {
          ...initialMockFarmer,
          ...parsedSaved,
          id: latestBackendFarmer._id || initialMockFarmer.id,
          name: latestBackendFarmer.name || initialMockFarmer.name,
          phone: latestBackendFarmer.phone || initialMockFarmer.phone,
          preferredLanguage: latestBackendFarmer.language || initialMockFarmer.preferredLanguage,
          village,
          taluka,
          district,
        };
      }
    } catch (e) {
      console.warn('Backend GET /farmers/ failed, using local cache:', e);
    }

    // 2. Fallback to localStorage
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
        console.error('Failed to parse farmer profile from localStorage', e);
      }
    }
    return initialMockFarmer;
  },

  /**
   * Register or update farmer profile (POST /farmers/ with local cache)
   */
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

    // Save to local storage for immediate offline/fast UI sync
    localStorage.setItem(LOCAL_STORAGE_FARMER_KEY, JSON.stringify(updated));

    // Send to backend POST /farmers/
    try {
      const payload: BackendFarmer = {
        name: updated.name,
        phone: updated.phone,
        language: updated.preferredLanguage || 'en',
        location: `${updated.village}, ${updated.taluka}, ${updated.district}, ${updated.state}`,
        crop: 'Tomato',
      };

      const res = await apiRequest<{ message: string; farmer_id?: string }>(ENDPOINTS.FARMERS, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.data && res.data.farmer_id) {
        updated.id = res.data.farmer_id;
        localStorage.setItem(LOCAL_STORAGE_FARMER_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Backend POST /farmers/ sync failed, cached locally:', e);
    }

    return updated;
  },
};
