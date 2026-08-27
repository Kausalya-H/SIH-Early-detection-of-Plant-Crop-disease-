export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type AlertCategory = 
  | 'DISEASE_OUTBREAK' 
  | 'PEST_WARNING' 
  | 'WEATHER_RISK' 
  | 'OFFICER_MESSAGE' 
  | 'ADVISORY_UPDATE';

export interface CropAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: AlertSeverity;
  affectedCrops: string[];
  region: string;
  district: string;
  description: string;
  actionRequired: string;
  createdAt: string;
  isRead: boolean;
  expiresAt?: string;
  source: string; // e.g. "Regional Agriculture Department, Maharashtra"
}
