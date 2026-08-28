import React from 'react';
import { StatCard } from '../common/StatCard';
import { Sprout, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Farm } from '../../types/farmer';

interface CropHealthOverviewProps {
  farms: Farm[];
  onSelectFilter?: (status: string) => void;
}

export const CropHealthOverview: React.FC<CropHealthOverviewProps> = ({ farms }) => {
  const { t } = useLanguage();

  const totalFarms = farms.length;
  const healthyCount = farms.filter((f) => f.crop.health === 'HEALTHY').length;
  const watchCount = farms.filter((f) => f.crop.health === 'WATCH').length;
  const highRiskCount = farms.filter((f) => f.crop.health === 'AFFECTED' || f.crop.health === 'CRITICAL').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <StatCard
        title={t.dashboard.totalFarms}
        value={totalFarms}
        subtitle="Active registered plots"
        icon={<Sprout className="h-6 w-6" />}
        variant="default"
      />
      <StatCard
        title={t.dashboard.healthyCrops}
        value={healthyCount}
        subtitle="Zero disease markers"
        icon={<CheckCircle2 className="h-6 w-6" />}
        variant="success"
      />
      <StatCard
        title={t.dashboard.cropsToWatch}
        value={watchCount}
        subtitle="Mild symptoms detected"
        icon={<AlertTriangle className="h-6 w-6" />}
        variant="warning"
      />
      <StatCard
        title={t.dashboard.highRiskCrops}
        value={highRiskCount}
        subtitle="Immediate care required"
        icon={<AlertOctagon className="h-6 w-6" />}
        variant="danger"
      />
    </div>
  );
};
