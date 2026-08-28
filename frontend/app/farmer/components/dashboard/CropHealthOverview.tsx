import React from 'react';
import { Farm } from '../../types/farmer';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { Link } from 'react-router-dom';
import { Sprout, ChevronRight, Calendar, Droplets } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CropHealthOverviewProps {
  farms: Farm[];
}

export const CropHealthOverview: React.FC<CropHealthOverviewProps> = ({ farms }) => {
  const { t } = useLanguage();

  return (
    <div className="card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t.dashboard.cropHealthOverview}</h2>
          <p className="text-xs text-slate-500">Live health monitoring status across all registered plots</p>
        </div>

        <Link
          to="/farmer/farms"
          className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-800"
        >
          <span>{t.dashboard.viewAll} ({farms.length})</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="rounded-2xl border border-stone-200 p-4 bg-stone-50/50 hover:bg-white hover:border-stone-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{farm.name}</h3>
                  <p className="text-xs text-slate-500">{farm.plotNumber} • {farm.village}</p>
                </div>
                <StatusBadge status={farm.crop.health} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 border border-stone-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Crop & Variety</span>
                  <span className="font-semibold text-slate-800">{farm.crop.name} ({farm.crop.variety || 'Standard'})</span>
                </div>

                <div className="rounded-xl bg-white p-2.5 border border-stone-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Stage</span>
                  <span className="font-semibold text-slate-800">{farm.crop.stage}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span>{farm.areaAcres} Acres</span>
                <span>•</span>
                <span>Irrigation: {farm.irrigationType}</span>
              </div>

              <RiskBadge level={farm.crop.currentRisk} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
