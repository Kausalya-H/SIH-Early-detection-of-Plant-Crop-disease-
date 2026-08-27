import { apiClient } from './client';

export interface HealthCheckResponse {
  status: string;
  version?: string;
  service?: string;
  uptime?: number;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Pings backend root endpoint.
 * Matches backend: GET /
 */
export async function getRootStatus(): Promise<Record<string, unknown>> {
  return apiClient<Record<string, unknown>>('/', {
    method: 'GET',
    timeoutMs: 5000,
  });
}

/**
 * Checks backend operational health and model readiness.
 * Matches backend: GET /health
 */
export async function getHealthStatus(): Promise<HealthCheckResponse> {
  return apiClient<HealthCheckResponse>('/health', {
    method: 'GET',
    timeoutMs: 5000,
  });
}
