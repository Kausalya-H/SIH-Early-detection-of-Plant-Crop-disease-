import { DiagnosisRecord } from '../types/disease';
import { mockDiagnoses } from '../data/mockDiagnoses';

const LOCAL_STORAGE_DIAGNOSES_KEY = 'farmer_portal_diagnoses';

export const diagnosisService = {
  async getDiagnoses(): Promise<DiagnosisRecord[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_DIAGNOSES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse diagnoses', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_DIAGNOSES_KEY, JSON.stringify(mockDiagnoses));
    return mockDiagnoses;
  },

  async getDiagnosisById(id: string): Promise<DiagnosisRecord | null> {
    const list = await this.getDiagnoses();
    return list.find((d) => d.id === id) || null;
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
