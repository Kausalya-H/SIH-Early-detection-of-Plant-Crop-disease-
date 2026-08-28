import { apiClient } from './client';
import {
  SystemUser,
  AdminSettings,
  NotificationGateway,
  AiModelMetric,
  AuditLog,
} from '@/types';

/**
 * Fetch all administrative users and agricultural officers.
 */
export async function getAdminUsers(): Promise<SystemUser[]> {
  return apiClient<SystemUser[]>('/admin/users', {
    method: 'GET',
  });
}

/**
 * Update administrative account status (ACTIVE | INACTIVE | SUSPENDED).
 */
export async function updateAdminUserStatus(
  userId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
): Promise<{
  message: string;
  user_id: string;
  status: string;
  user?: SystemUser;
}> {
  return apiClient(
    `/admin/users/${userId}/status?status=${encodeURIComponent(status)}`,
    {
      method: 'PATCH',
    }
  );
}

/**
 * Fetch global epidemic risk thresholds and AI configuration.
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  return apiClient<AdminSettings>('/admin/settings', {
    method: 'GET',
  });
}

/**
 * Update global epidemic risk thresholds and AI parameters.
 */
export async function updateAdminSettings(
  settings: Partial<AdminSettings>
): Promise<{
  message: string;
  settings: AdminSettings;
}> {
  return apiClient<{
    message: string;
    settings: AdminSettings;
  }>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

/**
 * Reset global settings to factory defaults.
 */
export async function resetAdminSettings(): Promise<{
  message: string;
  settings: AdminSettings;
}> {
  return apiClient<{
    message: string;
    settings: AdminSettings;
  }>('/admin/settings/reset', {
    method: 'POST',
  });
}

/**
 * Fetch national notification and satellite gateways.
 */
export async function getAdminGateways(): Promise<NotificationGateway[]> {
  return apiClient<NotificationGateway[]>('/admin/gateways', {
    method: 'GET',
  });
}

/**
 * Test ping dispatch to a specific notification gateway.
 */
export async function testAdminGateway(
  gatewayId: string
): Promise<{
  message: string;
  gateway_id: string;
  status: string;
  latencyMs?: number;
}> {
  return apiClient<{
    message: string;
    gateway_id: string;
    status: string;
    latencyMs?: number;
  }>(`/admin/gateways/${encodeURIComponent(gatewayId)}/ping`, {
    method: 'POST',
  });
}

/**
 * Fetch AI Vision & Epidemic model telemetry and benchmarks.
 */
export async function getAdminAiModels(): Promise<AiModelMetric[]> {
  return apiClient<AiModelMetric[]>('/admin/ai-models', {
    method: 'GET',
  });
}

/**
 * Fetch system compliance and administrative audit logs.
 */
export async function getAdminAuditLogs(): Promise<AuditLog[]> {
  return apiClient<AuditLog[]>('/admin/audit-logs', {
    method: 'GET',
  });
}