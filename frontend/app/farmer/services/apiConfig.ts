export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

export const USE_MOCK_DATA = false;

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  ROOT: `${API_BASE_URL}/`,

  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  AUTH_REGISTER_FULL: `${API_BASE_URL}/auth/register-full`,

  // Farmers
  FARMERS: `${API_BASE_URL}/farmers/`,
  FARMER_PROFILE: `${API_BASE_URL}/farmers/`,

  // Farms (new backend CRUD)
  FARMS: `${API_BASE_URL}/farms`,
  FARM_CREATE: `${API_BASE_URL}/farms`,

  // Disease
  DISEASE_PREDICT: `${API_BASE_URL}/disease/predict`,
  DISEASE_REPORT: `${API_BASE_URL}/disease/report`,

  // Reports (stored in DB)
  REPORTS: `${API_BASE_URL}/reports`,
  REPORT_STATS: `${API_BASE_URL}/reports/stats/summary`,

  // Weather
  WEATHER: `${API_BASE_URL}/weather`,
  WEATHER_LOCATIONS: `${API_BASE_URL}/weather/locations`,
  RISK_ZONES: `${API_BASE_URL}/risk/zones`,

  // Admin
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_SETTINGS: `${API_BASE_URL}/admin/settings`,
  ADMIN_AUDIT: `${API_BASE_URL}/admin/audit-logs`,
  ADVISORIES: `${API_BASE_URL}/advisories`,
  OFFICER_ASSISTANCE: `${API_BASE_URL}/officer/assistance`,
};
