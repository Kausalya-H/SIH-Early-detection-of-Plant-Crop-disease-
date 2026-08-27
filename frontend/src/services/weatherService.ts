import { WeatherData } from '../types/weather';
import { mockWeatherData } from '../data/mockWeather';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const weatherService = {
  async getWeather(location?: string): Promise<WeatherData> {
    if (!USE_MOCK_DATA) {
      const url = location ? `${ENDPOINTS.WEATHER}?location=${encodeURIComponent(location)}` : ENDPOINTS.WEATHER;
      const res = await apiRequest<WeatherData>(url);
      if (res.data) return res.data;
    }
    return mockWeatherData;
  }
};
