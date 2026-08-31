import React from 'react';
import { StatCard } from '../common/StatCard';
import { Sprout, ShieldCheck, AlertTriangle, Microscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FarmSummaryCardsProps {
  totalFarms?: number;
  healthyPercentage?: number;
  activeAlertsCount?: number;
  recentDiagnosesCount?: number;
}

export const FarmSummaryCards: React.FC<FarmSummaryCardsProps> = ({
  totalFarms = 0,
  healthyPercentage = 0,
  activeAlertsCount = 0,
  recentDiagnosesCount = 0,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        title={t.dashboard.myFarms}
        value={totalFarms}
        icon={<Sprout className="h-6 w-6 text-agri-700" />}
        subtitle="All registered plots"
        trend={{ value: totalFarms > 0 ? totalFarms + ' Registered' : 'No plots yet', isPositive: true }}
        colorScheme="green"
      />
      <StatCard
        title={t.dashboard.healthyCrops}
        value={healthyPercentage + '%'}
        icon={<ShieldCheck className="h-6 w-6 text-emerald-700" />}
        subtitle={healthyPercentage > 0 ? healthyPercentage + '% healthy' : 'No data yet'}
        trend={{ value: healthyPercentage > 0 ? healthyPercentage + '% Healthy' : 'Start scanning', isPositive: true }}
        colorScheme="emerald"
      />
      <StatCard
        title={t.dashboard.activeAlerts}
        value={activeAlertsCount}
        icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
        subtitle={activeAlertsCount > 0 ? 'Requires attention' : 'No active alerts'}
        trend={{ value: activeAlertsCount > 0 ? 'Action Required' : 'All clear', isPositive: false }}
        colorScheme="orange"
      />
      <StatCard
        title={t.dashboard.recentDiagnoses}
        value={recentDiagnosesCount}
        icon={<Microscope className="h-6 w-6 text-blue-700" />}
        subtitle={recentDiagnosesCount > 0 ? 'Latest scans' : 'No scans yet'}
        trend={{ value: recentDiagnosesCount > 0 ? recentDiagnosesCount + ' reports' : 'No reports yet', isPositive: true }}
        colorScheme="blue"
      />
    </div>
  );
};
