export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";

export const USE_MOCK_DATA = false;

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,

  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_REGISTER_FULL: `${API_BASE_URL}/auth/register-full`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,

  // Farms
  FARMS: `${API_BASE_URL}/farms`,
  FARM_DETAIL: (id: string) => `${API_BASE_URL}/farms/${id}`,
  FARM_CROPS: (farmId: string) => `${API_BASE_URL}/farms/${farmId}/crops`,

  // Reports
  REPORTS: `${API_BASE_URL}/reports`,
  REPORT_DETAIL: (id: string) => `${API_BASE_URL}/reports/${id}`,
  REPORT_STATUS: (id: string) => `${API_BASE_URL}/reports/${id}/status`,
  REPORT_STATS: `${API_BASE_URL}/reports/stats/summary`,

  // Disease detection
  DISEASE_PREDICT: `${API_BASE_URL}/disease/predict`,
  DISEASE_REPORT: `${API_BASE_URL}/disease/report`,

  // Weather
  WEATHER: `${API_BASE_URL}/weather`,

  // Alerts
  ALERTS: `${API_BASE_URL}/alerts`,
  ADVISORIES: `${API_BASE_URL}/advisory/advisories`,
  DISEASE_LIBRARY: `${API_BASE_URL}/advisory/diseases`,

  // Legacy farmer endpoints
  FARMERS: `${API_BASE_URL}/farmers/`,
};
