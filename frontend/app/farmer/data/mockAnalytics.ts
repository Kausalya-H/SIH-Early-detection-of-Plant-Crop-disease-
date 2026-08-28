import { FarmAnalyticsData } from '../types/analytics';

export const mockAnalyticsData: FarmAnalyticsData = {
  totalFarms: 4,
  totalAcreage: 12.5,
  overallHealthScore: 86,
  healthyCropsPercentage: 86,
  activeAlertsCount: 3,
  totalScansThisMonth: 21,
  healthDistribution: [
    { status: 'Healthy Crops', percentage: 65, plotCount: 2, color: '#16a34a' },
    { status: 'Under Watch', percentage: 25, plotCount: 1, color: '#eab308' },
    { status: 'Active Disease Risk', percentage: 10, plotCount: 1, color: '#ea580c' },
  ],
  monthlyTrends: [
    { month: 'Apr', scansCount: 8, diseasesDetected: 1, healthyCount: 7 },
    { month: 'May', scansCount: 12, diseasesDetected: 2, healthyCount: 10 },
    { month: 'Jun', scansCount: 15, diseasesDetected: 3, healthyCount: 12 },
    { month: 'Jul', scansCount: 19, diseasesDetected: 4, healthyCount: 15 },
    { month: 'Aug', scansCount: 21, diseasesDetected: 3, healthyCount: 18 },
  ],
  topDiseases: [
    { name: 'Early Blight', crop: 'Tomato', count: 5, risk: 'MODERATE' },
    { name: 'Leaf Curl / Thrips', crop: 'Chilli', count: 3, risk: 'HIGH' },
    { name: 'Bacterial Blight', crop: 'Cotton', count: 2, risk: 'MODERATE' },
    { name: 'Anthracnose', crop: 'Soybean', count: 1, risk: 'LOW' },
  ],
};
