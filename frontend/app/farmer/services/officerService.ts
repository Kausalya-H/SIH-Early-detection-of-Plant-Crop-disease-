import { OfficerAssistanceRequest } from '../types/weather';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

const LOCAL_STORAGE_OFFICER_KEY = 'farmer_portal_officer_requests';

export const officerService = {
  async submitRequest(request: OfficerAssistanceRequest): Promise<{ success: boolean; requestId: string; message: string }> {
    const requestId = `OAR-MH-${Date.now().toString().slice(-6)}`;
    const fullRequest = {
      ...request,
      id: requestId,
      createdAt: new Date().toISOString(),
      status: 'PENDING' as const,
    };

    if (!USE_MOCK_DATA) {
      const res = await apiRequest<any>(ENDPOINTS.OFFICER_ASSISTANCE, {
        method: 'POST',
        body: JSON.stringify(fullRequest),
      });
      if (res.data) {
        return {
          success: true,
          requestId: res.data.requestId || requestId,
          message: 'Officer assistance request submitted successfully.',
        };
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_OFFICER_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    existing.push(fullRequest);
    localStorage.setItem(LOCAL_STORAGE_OFFICER_KEY, JSON.stringify(existing));

    return {
      success: true,
      requestId,
      message: 'Assistance request received. Your Taluka Agricultural Extension Officer will contact you within 24-48 hours.',
    };
  },

  async getMyRequests(): Promise<OfficerAssistanceRequest[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_OFFICER_KEY);
    return saved ? JSON.parse(saved) : [];
  }
};
