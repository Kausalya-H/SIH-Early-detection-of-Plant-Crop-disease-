import { CropAlert } from '../types/alert';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

export const alertService = {
  async getAlerts(): Promise<CropAlert[]> {
    try {
      const res = await apiRequest<CropAlert[]>(ENDPOINTS.REPORTS + '/stats/summary');
      if (res.data) {
        // Build alerts from real report data
        const reports = res.data as any;
        const alerts: CropAlert[] = [];
        if (reports.highRiskReports && reports.highRiskReports > 0) {
          alerts.push({
            id: 'alert_auto_1',
            title: reports.highRiskReports + ' High-Risk Disease Reports Pending Review',
            category: 'DISEASE_OUTBREAK',
            severity: 'HIGH',
            affectedCrops: [],
            district: '',
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
            message: reports.highRiskReports + ' disease reports with high risk have been submitted and need review.',
            actionRequired: 'Review high-risk disease reports and take appropriate action.',
            isRead: false,
            issuedBy: 'System',
          });
        }
        return alerts;
      }
    } catch (e) {
      console.warn('Backend alerts failed:', e);
    }
    return [];
  },

  async markAsRead(id: string): Promise<void> {
    // No-op for now
  },
};
