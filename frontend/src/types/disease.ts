export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TreatmentRecommendation {
  chemicalControl: string[];
  biologicalControl: string[];
  culturalPractices: string[];
  safetyPrecautions: string[];
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
}
