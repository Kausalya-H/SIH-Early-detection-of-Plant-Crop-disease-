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
  issueDate: string;
  validUntil: string;
  message: string;
  actionRequired: string;
  isRead: boolean;
  issuedBy: string;
}
