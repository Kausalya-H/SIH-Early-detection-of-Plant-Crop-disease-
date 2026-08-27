import { RiskLevel } from './risk';
import { UserRole } from './auth';

export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type AlertChannel = 'SMS' | 'WHATSAPP' | 'IN_APP' | 'BROADCAST_RADIO';

export interface Alert {
  id: string;
  title: string;
  message: string;
  riskLevel: RiskLevel;
  severity: AlertSeverity;
  targetRole: UserRole | 'ALL';
  targetRegion: {
    state: string;
    district?: string;
    taluk?: string;
  };
  cropTargeted?: string;
  diseaseRef?: string;
  channelsSent: AlertChannel[];
  recipientsCount: number;
  deliveredCount: number;
  createdAt: string;
  expiresAt?: string;
  isRead?: boolean;
}

export interface BroadcastAlertDraft {
  title: string;
  message: string;
  riskLevel: RiskLevel;
  targetState: string;
  targetDistricts: string[];
  targetCrops: string[];
  channels: AlertChannel[];
}
