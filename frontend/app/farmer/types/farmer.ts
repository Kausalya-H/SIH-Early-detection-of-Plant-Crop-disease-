export type HealthStatus = 'HEALTHY' | 'WATCH' | 'AFFECTED' | 'CRITICAL';

export type CropStage = 'SOWING' | 'VEGETATIVE' | 'FLOWERING' | 'FRUITING' | 'MATURITY' | 'HARVEST_READY';

export interface CropInfo {
  name: string;
  variety?: string;
  sowingDate: string;
  expectedHarvestDate?: string;
  stage: CropStage;
  health: HealthStatus;
  currentRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  plotNumber?: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  areaAcres: number;
  soilType?: string;
  irrigationType?: 'DRIP' | 'SPRINKLER' | 'FLOOD' | 'RAINFED';
  crop: CropInfo;
  lastScanDate?: string;
  totalScansCount: number;
  createdAt: string;
  lat?: number | null;
  lng?: number | null;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  preferredLanguage: string;
  notificationPreferences: {
    sms: boolean;
    whatsapp: boolean;
    inApp: boolean;
    weatherAlerts: boolean;
    diseaseWarnings: boolean;
  };
  totalFarms: number;
  totalAcreage: number;
  joinedDate: string;
}
