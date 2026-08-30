import { CropAlert } from '../types/alert';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

const ALERTS_ENDPOINT = ENDPOINTS.ALERTS;

export const alertService = {
  async getAlerts(): Promise<CropAlert[]> {
    const res = await apiRequest<CropAlert[]>(ALERTS_ENDPOINT);
    if (res.data) {
      return res.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        severity: a.severity,
        affectedCrops: a.affectedCrops || [],
        district: a.district || '',
        issueDate: a.issueDate || '',
        validUntil: a.validUntil || '',
        message: a.message,
        actionRequired: a.actionRequired || '',
        isRead: a.isRead || false,
        issuedBy: a.issuedBy || 'System',
        source: a.source || '',
      }));
    }
    return [];
  },

  async markAsRead(id: string): Promise<void> {
    // Mark as read locally (no backend endpoint needed for now)
  },
};
