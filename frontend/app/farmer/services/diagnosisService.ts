import { DiagnosisRecord, BackendPredictResponse, RiskLevel } from '../types/disease';
import { mockDiagnoses } from '../data/mockDiagnoses';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

const LOCAL_STORAGE_DIAGNOSES_KEY = 'farmer_portal_diagnoses';

export interface GenerateReportParams {
  file: File | Blob;
  crop: string;
  farmer_name?: string;
  phone?: string;
  location?: string;
  filename?: string;
}

export const diagnosisService = {
  /**
   * Get all diagnosis records from local storage or mock initial data
   */
  async getDiagnoses(): Promise<DiagnosisRecord[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_DIAGNOSES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse diagnoses from localStorage', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_DIAGNOSES_KEY, JSON.stringify(mockDiagnoses));
    return mockDiagnoses;
  },

  /**
   * Get diagnosis record by ID
   */
  async getDiagnosisById(id: string): Promise<DiagnosisRecord | null> {
    const list = await this.getDiagnoses();
    return list.find((d) => d.id === id) || null;
  },

  /**
   * Real AI disease prediction endpoint (POST /disease/predict)
   */
  async predictDisease(
    imageFile: File | Blob,
    crop: string
  ): Promise<{ data: BackendPredictResponse | null; error: string | null }> {
    const formData = new FormData();
    const fileName = imageFile instanceof File ? imageFile.name : `${crop.toLowerCase()}_sample.jpg`;
    formData.append('file', imageFile, fileName);
    formData.append('crop', crop);

    const res = await apiRequest<BackendPredictResponse>(ENDPOINTS.DISEASE_PREDICT, {
      method: 'POST',
      body: formData,
    });

    if (res.data) {
      return { data: res.data, error: null };
    }

    return { data: null, error: res.error || 'Failed to predict disease from backend' };
  },

  /**
   * Generate & download PDF Crop Health Report (POST /disease/report)
   */
  async generateReport(params: GenerateReportParams): Promise<{ blob: Blob | null; error: string | null }> {
    const formData = new FormData();
    const fileName = params.file instanceof File ? params.file.name : `${params.crop.toLowerCase()}_sample.jpg`;
    formData.append('file', params.file, fileName);
    formData.append('crop', params.crop);
    formData.append('farmer_name', params.farmer_name || 'Farmer');
    formData.append('phone', params.phone || 'Not provided');
    formData.append('location', params.location || 'Not provided');

    const res = await apiRequest<Blob>(ENDPOINTS.DISEASE_REPORT, {
      method: 'POST',
      body: formData,
    });

    if (res.data instanceof Blob) {
      // Trigger browser download of PDF report
      const blobUrl = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = params.filename || `${params.crop}_crop_health_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

      return { blob: res.data, error: null };
    }

    return { blob: null, error: res.error || 'Failed to generate PDF report from backend' };
  },

  /**
   * Save diagnosis record to history
   */
  async addDiagnosis(record: Omit<DiagnosisRecord, 'id' | 'diagnosedAt'>): Promise<DiagnosisRecord> {
    const list = await this.getDiagnoses();
    const newRecord: DiagnosisRecord = {
      ...record,
      id: `diag_${Date.now()}`,
      diagnosedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const updated = [newRecord, ...list];
    localStorage.setItem(LOCAL_STORAGE_DIAGNOSES_KEY, JSON.stringify(updated));
    return newRecord;
  },
};
