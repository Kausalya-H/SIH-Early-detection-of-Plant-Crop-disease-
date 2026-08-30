import { apiRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export interface DiseaseReport {
  _id: string;
  userId: string;
  farmId?: string;
  cropId?: string;
  cropName: string;
  disease: string;
  confidence: number;
  diseaseCategory?: string;
  causalAgent?: string;
  severity?: string;
  weather?: any;
  riskScore?: number;
  overallSeverity?: string;
  treatment?: string;
  activeIngredient?: string;
  safetyNote?: string;
  status: "pending" | "confirmed" | "flagged";
  createdAt: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  confirmed: number;
  flagged: number;
}

export const reportService = {
  async getMyReports(filters?: { farmId?: string; cropName?: string; status?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.farmId) params.set("farmId", filters.farmId);
    if (filters?.cropName) params.set("cropName", filters.cropName);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.limit) params.set("limit", String(filters.limit));
    const qs = params.toString();
    const url = qs ? `${ENDPOINTS.REPORTS}?${qs}` : ENDPOINTS.REPORTS;
    return apiRequest<DiseaseReport[]>(url);
  },

  async getReport(reportId: string) {
    return apiRequest<DiseaseReport>(ENDPOINTS.REPORT_DETAIL(reportId));
  },

  async updateStatus(reportId: string, status: string) {
    return apiRequest<any>(`${ENDPOINTS.REPORT_STATUS(reportId)}?status=${status}`, {
      method: "PATCH",
    });
  },

  async getStats() {
    return apiRequest<ReportStats>(ENDPOINTS.REPORT_STATS);
  },
};
