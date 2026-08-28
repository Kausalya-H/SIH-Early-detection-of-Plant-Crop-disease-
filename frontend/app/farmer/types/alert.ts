export type AlertSeverity = 'INFO' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertCategory = 'DISEASE_OUTBREAK' | 'PEST_SURGE' | 'WEATHER_WARNING' | 'OFFICER_ADVISORY';

export interface CropAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: AlertSeverity;
  affectedCrops: string[];
  district: string;
  taluka?: string;
  region?: string;
  issueDate: string;
  createdAt?: string;
  validUntil: string;
  message: string;
  description?: string;
  actionRequired: string;
  recommendations?: string[];
  isRead: boolean;
  issuedBy: string;
  source?: string;
}
