export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskEvaluation {
  level: RiskLevel;
  score: number; // 0 to 100
  factors: {
    weatherIndex?: number;
    spreadRate?: number;
    densityFactor?: number;
    cropVulnerability?: number;
  };
  summary: string;
  recommendedAction?: string;
  assessedAt: string;
}

export interface RiskZone {
  id: string;
  name: string;
  state: string;
  district: string;
  riskLevel: RiskLevel;
  affectedCrops: string[];
  activeOutbreaksCount: number;
  monitoredFarmsCount: number;
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
