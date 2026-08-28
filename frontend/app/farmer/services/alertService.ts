import { CropAlert } from '../types/alert';
import { mockAlerts } from '../data/mockAlerts';

const LOCAL_STORAGE_ALERTS_KEY = 'farmer_portal_alerts_v2';

export const alertService = {
  async getAlerts(): Promise<CropAlert[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_ALERTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse alerts', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(mockAlerts));
    return mockAlerts;
  },

  async markAsRead(id: string): Promise<void> {
    const alerts = await this.getAlerts();
    const updated = alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(updated));
  },
};
