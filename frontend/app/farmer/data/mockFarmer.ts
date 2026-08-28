import { FarmerProfile } from '../types/farmer';

export const initialMockFarmer: FarmerProfile = {
  id: 'MH-413801',
  name: 'Ramesh Narayan Patil',
  phone: '+91 98220 14321',
  email: 'ramesh.patil@agrimail.in',
  village: 'Malegaon Khurd',
  taluka: 'Baramati',
  district: 'Pune',
  state: 'Maharashtra',
  preferredLanguage: 'en',
  notificationPreferences: {
    sms: true,
    whatsapp: true,
    inApp: true,
    weatherAlerts: true,
    diseaseWarnings: true,
  },
  totalFarms: 4,
  totalAcreage: 12.5,
  joinedDate: '2025-06-15',
};
