import { CropAlert } from '../types/alert';
import { mockAlerts } from '../data/mockAlerts';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

const LOCAL_STORAGE_ALERTS_KEY = 'farmer_portal_alerts';

export const alertService = {
  async getAlerts(): Promise<CropAlert[]> {
    if (!USE_MOCK_DATA) {
      const res = await apiRequest<CropAlert[]>(ENDPOINTS.ALERTS);
      if (res.data) return res.data;
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_ALERTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached alerts', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(mockAlerts));
    return mockAlerts;
  },

  async markAsRead(alertId: string): Promise<void> {
    const alerts = await this.getAlerts();
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(updated));
  },

  async markAllAsRead(): Promise<void> {
    const alerts = await this.getAlerts();
    const updated = alerts.map((a) => ({ ...a, isRead: true }));
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(updated));
  }
};
