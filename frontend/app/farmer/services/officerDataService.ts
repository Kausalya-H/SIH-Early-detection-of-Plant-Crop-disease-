/**
 * OfficerDataService — fetches real weather, risk zone, and outbreak data
 * from the FastAPI backend instead of hardcoded mocks.
 */

import { apiRequest } from './apiClient';

export interface RiskZoneData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  diseaseRiskIndex: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
  diseaseRiskScore: number;
  diseaseRiskReason: string;
  sporeDispersalRangeKm?: number;
  pathogenRisk?: {
    fungal: { level: string; score: number };
    bacterial: { level: string; score: number };
    oomycete: { level: string; score: number };
  };
  weather: {
    location: string;
    temperatureC: number;
    condition: string;
    humidityPercent: number;
    windSpeedKmh: number;
    rainfallChancePercent: number;
    forecastSummary: string;
  };
  updatedAt: string;
}

export interface RiskZonesResponse {
  zones: RiskZoneData[];
  totalZones: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  lowCount: number;
}

export const officerDataService = {
  /**
   * Fetch real-time risk zones from GET /risk/zones
   */
  async getRiskZones(): Promise<RiskZonesResponse | null> {
    const res = await apiRequest<RiskZonesResponse>('/risk/zones');
    return res.data;
  },

  /**
   * Fetch weather for a specific location
   */
  async getWeather(location?: string): Promise<any | null> {
    const url = location
      ? `/weather?location=${encodeURIComponent(location)}`
      : '/weather';
    const res = await apiRequest<any>(url);
    return res.data;
  },
};
