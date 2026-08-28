import { FarmAnalyticsData } from '../types/analytics';
import { mockAnalyticsData } from '../data/mockAnalytics';

export const analyticsService = {
  async getAnalytics(): Promise<FarmAnalyticsData> {
    return mockAnalyticsData;
  },
};
