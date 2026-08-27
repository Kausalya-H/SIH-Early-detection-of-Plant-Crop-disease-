import { RiskLevel } from './risk';

export interface DiseaseTreatment {
  type: 'CHEMICAL' | 'BIOLOGICAL' | 'CULTURAL' | 'PREVENTATIVE';
  title: string;
  instructions: string;
  dosage?: string;
  timing?: string;
  safetyIntervalDays?: number;
}

export interface Disease {
  id: string;
  name: string;
  scientificName?: string;
  category: 'FUNGAL' | 'BACTERIAL' | 'VIRAL' | 'PEST' | 'DEFICIENCY' | 'OTHER';
  affectedCrops: string[];
  symptoms: string[];
  severityDefault: RiskLevel;
  imageUrl?: string;
  treatments: DiseaseTreatment[];
  description: string;
}

export interface DiseasePrediction {
  diseaseName: string;
  crop: string;
  confidence: number; // 0.0 - 1.0 or 0 - 100
  riskLevel: RiskLevel;
  description?: string;
  advisory?: string[];
  rawResponse?: Record<string, unknown>;
}

export interface DiseaseReport {
  id?: string;
  crop: string;
  farmerName: string;
  phone: string;
  location: string;
  imageUrl?: string;
  diseasePredicted?: string;
  confidence?: number;
  reportedAt?: string;
  status?: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'DISMISSED';
}
