/**
 * Centralized API Configuration
 * 
 * When backend server is active at http://localhost:8000,
 * this configuration connects directly to the FastAPI endpoints.
 * When USE_MOCK_DATA is true (or when the backend is unreachable),
 * the frontend smoothly falls back to the realistic demo data layer.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // Default to true for robust offline demo

export const ENDPOINTS = {
  // Health & Core
  HEALTH: `${API_BASE_URL}/health`,
  
  // Farmer endpoints (FastAPI /farmers)
  FARMERS: `${API_BASE_URL}/farmers`,
  FARMER_PROFILE: `${API_BASE_URL}/farmers/me`,
  
  // Disease prediction & PDF report (FastAPI /disease)
  DISEASE_PREDICT: `${API_BASE_URL}/disease/predict`,
  DISEASE_REPORT: `${API_BASE_URL}/disease/report`,
  
  // Future extension endpoints
  FARMS: `${API_BASE_URL}/farms`,
  SCANS_HISTORY: `${API_BASE_URL}/scans`,
  ALERTS: `${API_BASE_URL}/alerts`,
  ADVISORIES: `${API_BASE_URL}/advisories`,
  OFFICER_ASSISTANCE: `${API_BASE_URL}/officer/request`,
  WEATHER: `${API_BASE_URL}/weather`,
};
