export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TreatmentRecommendation {
  chemicalControl: string[];
  biologicalControl: string[];
  culturalPractices: string[];
  safetyPrecautions: string[];
}

export interface BackendPredictResponse {
  crop: string;
  disease: string;
  confidence: number;
  severity?: string;
  warning_signs?: string[];
  advice?: string;
  treatment?: string;
  active_ingredient?: string;
  application?: string;
  safety_note?: string;
  message?: string;
}

export interface DiagnosisRecord {
  id: string;
  farmId: string;
  farmName: string;
  cropName: string;
  cropVariety?: string;
  imageUrl: string;
  diseaseDetected: string;
  scientificName?: string;
  confidence: number;
  riskLevel: RiskLevel;
  symptoms: string[];
  diagnosedAt: string;
  treatment: TreatmentRecommendation;
  status: 'REVIEWED' | 'ACTION_TAKEN' | 'PENDING' | 'RESOLVED';
  officerNotes?: string;

  // Backend direct response fields
  severity?: string;
  warning_signs?: string[];
  advice?: string;
  treatmentText?: string;
  active_ingredient?: string;
  application?: string;
  safety_note?: string;
  message?: string;
  isLiveBackendResult?: boolean;
}
