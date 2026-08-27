import { RiskLevel } from './risk';
import { Location } from './location';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  language: string;
  location: string;
  crop: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmName?: string;
  acreage: number; // in acres
  primaryCrop: string;
  secondaryCrops?: string[];
  location: Location;
  currentRiskLevel: RiskLevel;
  lastInspectionDate?: string;
  lastReportedDisease?: string;
  soilType?: string;
  irrigationType?: string;
}

export interface CreateFarmerPayload {
  name: string;
  phone: string;
  language: string;
  location: string;
  crop: string;
}
