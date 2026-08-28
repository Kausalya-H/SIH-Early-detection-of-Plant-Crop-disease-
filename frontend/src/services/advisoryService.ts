import { AdvisoryItem, DiseaseKnowledgeItem, AdvisoryCategory } from '../types/advisory';
import { mockAdvisories, mockDiseaseLibrary } from '../data/mockAdvisories';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const advisoryService = {
  async getAdvisories(category?: AdvisoryCategory): Promise<AdvisoryItem[]> {
    if (!USE_MOCK_DATA) {
      const url = category ? `${ENDPOINTS.ADVISORIES}?category=${category}` : ENDPOINTS.ADVISORIES;
      const res = await apiRequest<AdvisoryItem[]>(url);
      if (res.data) return res.data;
    }
    if (category) {
      return mockAdvisories.filter((a) => a.category === category);
    }
    return mockAdvisories;
  },

  async getDiseaseLibrary(crop?: string, query?: string): Promise<DiseaseKnowledgeItem[]> {
    let list = mockDiseaseLibrary;
    if (crop && crop !== 'ALL') {
      list = list.filter((d) => d.crop.toLowerCase() === crop.toLowerCase());
    }
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.diseaseName.toLowerCase().includes(q) ||
          d.crop.toLowerCase().includes(q) ||
          d.commonSymptoms.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getDiseaseById(id: string): Promise<DiseaseKnowledgeItem | null> {
    return mockDiseaseLibrary.find((d) => d.id === id) || null;
  }
};
