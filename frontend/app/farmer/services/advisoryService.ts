import { AdvisoryItem, DiseaseKnowledgeItem, AdvisoryCategory } from '../types/advisory';

import { ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const advisoryService = {
  async getAdvisories(category?: AdvisoryCategory): Promise<AdvisoryItem[]> {
    const url = category ? `${ENDPOINTS.ADVISORIES}?category=${category}` : ENDPOINTS.ADVISORIES;
    const res = await apiRequest<any[]>(url);
    if (res.data) {
      return res.data.map((a: any) => ({
        id: a.id,
        title: a.title,
        category: a.category || 'CROP_HEALTH',
        severity: a.severity || 'MODERATE',
        crop: a.crop || '',
        message: a.message,
        issuedBy: a.issuedBy || 'System',
        issueDate: a.issueDate || '',
        validUntil: a.validUntil || '',
      }));
    }
    return [];
  },

  async getDiseaseLibrary(crop?: string, query?: string): Promise<DiseaseKnowledgeItem[]> {
    let url = ENDPOINTS.DISEASE_LIBRARY;
    const params = new URLSearchParams();
    if (crop && crop !== 'ALL') params.set('crop', crop);
    if (query) params.set('query', query);
    const qs = params.toString();
    if (qs) url += '?' + qs;
    const res = await apiRequest<any[]>(url);
    if (res.data) {
      return res.data.map((d: any) => ({
        id: d.id,
        crop: d.crop,
        diseaseName: d.diseaseName,
        commonSymptoms: d.commonSymptoms || [],
        prevention: d.prevention || '',
        treatment: d.treatment || '',
        causalAgent: d.causalAgent || '',
        category: d.category || '',
      }));
    }
    return [];
  },

  async getDiseaseById(id: string): Promise<DiseaseKnowledgeItem | null> {
    return mockDiseaseLibrary.find((d) => d.id === id) || null;
  }
};
