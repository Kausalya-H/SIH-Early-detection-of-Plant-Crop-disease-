import { RiskLevel } from './risk';
import { Location } from './location';

export type OutbreakStatus = 'SUSPECTED' | 'CONFIRMED' | 'CONTAINING' | 'RESOLVED';

export interface Outbreak {
  id: string;
  code: string; // e.g. OB-2026-MH-081
  diseaseId: string;
  diseaseName: string;
  crop: string;
  location: Location;
  riskLevel: RiskLevel;
  status: OutbreakStatus;
  affectedFarmsCount: number;
  totalAcreageAffected: number;
  firstDetectedAt: string;
  lastUpdatedAt: string;
  containmentProgressPercent: number;
  officerInCharge?: {
    id: string;
    name: string;
    phone: string;
  };
  summaryNotes?: string;
}

export interface OutbreakTrend {
  period: string;
  casesReported: number;
  farmsAffected: number;
  resolvedCases: number;
  riskDistribution: Record<RiskLevel, number>;
}
