import { AdvisoryItem, DiseaseKnowledgeItem, AdvisoryCategory } from '../types/advisory';
import { mockAdvisories, mockDiseaseLibrary } from '../data/mockAdvisories';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const advisoryService = {
  /**
   * Fetches seasonal agricultural advisories from backend or fallback mock data
   */
  async getAdvisories(category?: AdvisoryCategory | string): Promise<AdvisoryItem[]> {
    try {
      if (!USE_MOCK_DATA) {
        const url = category && category !== 'ALL' 
          ? `${ENDPOINTS.ADVISORIES}?category=${category}` 
          : ENDPOINTS.ADVISORIES;
        
        const res = await apiRequest<any>(url);
        
        if (res.data) {
          let list: AdvisoryItem[] = [];
          if (Array.isArray(res.data)) {
            list = res.data;
          } else if (res.data && Array.isArray((res.data as any).advisories)) {
            list = (res.data as any).advisories;
          } else if (res.data && Array.isArray((res.data as any).data)) {
            list = (res.data as any).data;
          }

          if (list && list.length > 0) {
            if (category && category !== 'ALL') {
              return list.filter((a) => a && a.category === category);
            }
            return list;
          }
        }
      }
    } catch (err) {
      console.warn('Advisory API request failed, using fallback mock advisories:', err);
    }

    // Defensive fallback: Always return a guaranteed array
    const defaultList = Array.isArray(mockAdvisories) ? mockAdvisories : [];
    if (category && category !== 'ALL') {
      return defaultList.filter((a) => a && a.category === category);
    }
    return defaultList;
  },

  /**
   * Fetches searchable crop disease knowledge library
   */
  async getDiseaseLibrary(crop?: string, query?: string): Promise<DiseaseKnowledgeItem[]> {
    let list: DiseaseKnowledgeItem[] = Array.isArray(mockDiseaseLibrary) ? mockDiseaseLibrary : [];
    
    if (crop && crop !== 'ALL') {
      list = list.filter((d) => d && d.crop && d.crop.toLowerCase() === crop.toLowerCase());
    }
    
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d &&
          ((d.diseaseName && d.diseaseName.toLowerCase().includes(q)) ||
            (d.crop && d.crop.toLowerCase().includes(q)) ||
            (Array.isArray(d.commonSymptoms) &&
              d.commonSymptoms.some((s) => s && s.toLowerCase().includes(q))))
      );
    }
    return list;
  },

  /**
   * Retrieves single disease profile by ID
   */
  async getDiseaseById(id: string): Promise<DiseaseKnowledgeItem | null> {
    if (!Array.isArray(mockDiseaseLibrary)) return null;
    return mockDiseaseLibrary.find((d) => d && d.id === id) || null;
  },
};
