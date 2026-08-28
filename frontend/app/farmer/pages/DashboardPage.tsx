import React, { useEffect, useState } from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { FarmSummaryCards } from '../components/dashboard/FarmSummaryCards';
import { CropHealthOverview } from '../components/dashboard/CropHealthOverview';
import { ActiveAlertsSection } from '../components/dashboard/ActiveAlertsSection';
import { RecentDiagnosesSection } from '../components/dashboard/RecentDiagnosesSection';
import { QuickActions } from '../components/dashboard/QuickActions';
import { farmService } from '../services/farmService';
import { diagnosisService } from '../services/diagnosisService';
import { alertService } from '../services/alertService';
import { analyticsService } from '../services/analyticsService';
import { Farm } from '../types/farmer';
import { DiagnosisRecord } from '../types/disease';
import { CropAlert } from '../types/alert';
import { FarmAnalyticsData } from '../types/analytics';

export const DashboardPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [analytics, setAnalytics] = useState<FarmAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [f, d, a, an] = await Promise.all([
          farmService.getFarms(),
          diagnosisService.getDiagnoses(),
          alertService.getAlerts(),
          analyticsService.getAnalytics(),
        ]);
        setFarms(f);
        setDiagnoses(d);
        setAlerts(a);
        setAnalytics(an);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome & Farmer Greeting Banner */}
      <WelcomeBanner />

      {/* 2. Farm Summary KPI Cards */}
      <FarmSummaryCards
        totalFarms={farms.length}
        healthyPercentage={analytics?.healthyCropsPercentage || 86}
        activeAlertsCount={alerts.length}
        recentDiagnosesCount={diagnoses.length}
      />

      {/* 3. Useful Quick Action Buttons */}
      <QuickActions />

      {/* 4. Crop Health Information Breakdown */}
      <CropHealthOverview farms={farms} />

      {/* 5. Active Regional Alerts & Weather Warnings */}
      <ActiveAlertsSection alerts={alerts} />

      {/* 6. Recent Disease Diagnoses & AI Outputs */}
      <RecentDiagnosesSection diagnoses={diagnoses} />
    </div>
  );
};
