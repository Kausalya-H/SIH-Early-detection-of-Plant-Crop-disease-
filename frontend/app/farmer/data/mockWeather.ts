import { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  location: "Baramati, Pune, Maharashtra",
  temperatureC: 27,
  condition: "Partly Cloudy with Scattered Showers",
  humidityPercent: 84,
  windSpeedKmh: 14,
  rainfallChancePercent: 65,
  forecastSummary: "Moderate rainfall and continuous high relative humidity (>80%) expected over the next 48-72 hours across Western Maharashtra.",
  diseaseRiskIndex: "HIGH",
  diseaseRiskReason: "High humidity (84%) combined with moderate temperatures (25-28°C) creates elevated risk for fungal leaf spots (Early Blight, Tikka) and oomycete Late Blight.",
  updatedAt: "2026-08-27T10:00:00Z"
};
