export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ScanResult {
  crop: string;
  disease: string;
  confidence: number; // e.g. 91.5
  riskLevel: RiskLevel;
  severity: string; // "Low", "Medium", "High", "Critical"
  warning_signs: string[];
  symptoms: string[];
  explanation: string;
  advice: string;
  treatment: string;
  active_ingredient?: string;
  application?: string;
  safety_note: string;
  preventive_measures: string[];
  disclaimer: string;
}

export interface CropScan {
  id: string;
  farmerId: string;
  farmId: string;
  farmName: string;
  cropName: string;
  imageUrl: string;
  thumbnailUrl?: string;
  scanDate: string;
  result: ScanResult;
  officerAssistanceRequested?: boolean;
  officerAssistanceStatus?: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  officerNotes?: string;
}

export interface ScanUploadPayload {
  file: File;
  crop: string;
  farmId?: string;
  farmerName?: string;
  phone?: string;
  location?: string;
}
