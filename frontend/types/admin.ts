import { UserRole } from './auth';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  department: string;
  state: string;
  district?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastActive: string;
}

export type AuditActionType =
  | 'USER_LOGIN'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'OUTBREAK_STATUS_CHANGED'
  | 'ALERT_BROADCASTED'
  | 'MODEL_WEIGHTS_UPDATED'
  | 'DATA_EXPORTED'
  | 'SYSTEM_CONFIG_UPDATED';

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditActionType;
  entityType: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
  metadata?: Record<string, unknown>;
}

export interface AiModelMetric {
  id: string;
  modelName: string;
  version: string;
  targetCropsCount: number;
  classesCount: number;
  accuracy: number; // e.g. 96.8
  f1Score: number;
  latencyMs: number;
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  lastInferenceAt: string;
  totalInferencesToday: number;
  failedInferencesToday: number;
}
