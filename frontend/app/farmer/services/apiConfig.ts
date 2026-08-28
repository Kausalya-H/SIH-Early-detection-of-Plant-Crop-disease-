/**
 * Centralized API Configuration for Farmer Portal
 * 
 * Configured for FastAPI backend (http://localhost:8000).
 * Supports both direct backend access and Vite proxy routing.
 */

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

export const USE_MOCK_DATA = false;

export const ENDPOINTS = {
  // Backend Health Check
  HEALTH: `${API_BASE_URL}/health`,
  ROOT: `${API_BASE_URL}/`,

  // Farmer endpoints (FastAPI /farmers)
  FARMERS: `${API_BASE_URL}/farmers/`,
  FARMER_PROFILE: `${API_BASE_URL}/farmers/`,
  
  // Disease prediction & PDF report (FastAPI /disease)
  DISEASE_PREDICT: `${API_BASE_URL}/disease/predict`,
  DISEASE_REPORT: `${API_BASE_URL}/disease/report`,

  // Local fallback endpoints
  FARMS: `${API_BASE_URL}/farms`,
  ALERTS: `${API_BASE_URL}/alerts`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
  ADVISORIES: `${API_BASE_URL}/advisories`,
  OFFICER_ASSISTANCE: `${API_BASE_URL}/officer/request`,
  WEATHER: `${API_BASE_URL}/weather`,
  SCANS_HISTORY: `${API_BASE_URL}/scans`,
};
