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
  lat?: number;
  lng?: number;
  filename?: string;
}

export const diagnosisService = {
  async getDiagnoses(): Promise<DiagnosisRecord[]> {
    // Try loading from backend first
    try {
      const res = await apiRequest<DiagnosisRecord[]>(ENDPOINTS.REPORTS);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((r: any) => ({
          id: r.id || r._id,
          farmId: r.farmId || '',
          farmName: r.farmId || 'My Farm',
          cropName: r.cropName || '',
          imageUrl: '',
          diseaseDetected: r.disease || '',
          confidence: r.confidence || 0,
          riskLevel: (r.overallSeverity || r.severity || 'LOW') as RiskLevel,
          severity: r.severity || '',
          symptoms: [],
          advice: r.advice || '',
          treatmentText: r.treatment || '',
          active_ingredient: '',
          application: '',
          safety_note: '',
          message: '',
          treatment: { chemicalControl: [], biologicalControl: [], culturalPractices: [], safetyPrecautions: [] },
          status: (r.status || 'pending') as any,
          isLiveBackendResult: true,
          diagnosedAt: r.createdAt || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('Backend /reports failed, using localStorage:', e);
    }

    // Fallback to localStorage
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

  async getDiagnosisById(id: string): Promise<DiagnosisRecord | null> {
    const list = await this.getDiagnoses();
    return list.find((d) => d.id === id) || null;
  },

  async predictDisease(
    imageFile: File | Blob,
    crop: string,
    lat?: number,
    lng?: number,
    farmId?: string
  ): Promise<{ data: BackendPredictResponse | null; error: string | null }> {
    const formData = new FormData();
    const fileName = imageFile instanceof File ? imageFile.name : `${crop.toLowerCase()}_sample.jpg`;
    formData.append('file', imageFile, fileName);
    formData.append('crop', crop);

    let url = ENDPOINTS.DISEASE_PREDICT;
    if (lat !== undefined && lng !== undefined) {
      url += `?lat=${lat}&lng=${lng}`;
    }

    const res = await apiRequest<BackendPredictResponse>(url, {
      method: 'POST',
      body: formData,
    });

    if (res.data) {
      // Save report to backend
      try {
        const reportParams = new URLSearchParams();
        if (farmId) reportParams.append('farmId', farmId);
        reportParams.append('cropName', res.data.crop || crop);
        reportParams.append('disease', res.data.disease || '');
        reportParams.append('confidence', String(res.data.confidence || 0));
        if (res.data.severity) reportParams.append('severity', res.data.severity);
        if (res.data.overallSeverity) reportParams.append('overallSeverity', res.data.overallSeverity);
        if (res.data.overallRiskScore) reportParams.append('overallRiskScore', String(res.data.overallRiskScore));
        if (res.data.advice) reportParams.append('advice', res.data.advice);
        if (res.data.treatment) reportParams.append('treatment', res.data.treatment);

        await apiRequest(`${ENDPOINTS.REPORTS}?${reportParams.toString()}`, {
          method: 'POST',
        });
      } catch (e) {
        console.warn('Failed to save report to backend:', e);
      }

      return { data: res.data, error: null };
    }

    return { data: null, error: res.error || 'Failed to predict disease from backend' };
  },

  async generateReport(params: GenerateReportParams): Promise<{ blob: Blob | null; error: string | null }> {
    const formData = new FormData();
    const fileName = params.file instanceof File ? params.file.name : `${params.crop.toLowerCase()}_sample.jpg`;
    formData.append('file', params.file, fileName);
    formData.append('crop', params.crop);
    formData.append('farmer_name', params.farmer_name || 'Farmer');
    formData.append('phone', params.phone || 'Not provided');
    formData.append('location', params.location || 'Not provided');
    if (params.lat !== undefined) formData.append('lat', String(params.lat));
    if (params.lng !== undefined) formData.append('lng', String(params.lng));

    const res = await apiRequest<Blob>(ENDPOINTS.DISEASE_REPORT, {
      method: 'POST',
      body: formData,
    });

    if (res.data instanceof Blob) {
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
