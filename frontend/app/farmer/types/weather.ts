export interface WeatherData {
  location: string;
  temperatureC: number;
  condition: string;
  humidityPercent: number;
  windSpeedKmh: number;
  rainfallChancePercent: number;
  forecastSummary: string;
  diseaseRiskIndex: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  diseaseRiskReason: string;
  updatedAt: string;
}

export interface OfficerAssistanceRequest {
  id?: string;
  farmerId: string;
  farmerName: string;
  phone: string;
  farmId: string;
  farmName: string;
  cropName: string;
  scanId?: string;
  issueType: 'DISEASE' | 'PEST' | 'SOIL_FERTILITY' | 'OTHER';
  description: string;
  urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  preferredContactMode: 'PHONE_CALL' | 'FIELD_VISIT' | 'WHATSAPP';
  createdAt?: string;
  status?: 'PENDING' | 'IN_REVIEW' | 'COMPLETED';
}
