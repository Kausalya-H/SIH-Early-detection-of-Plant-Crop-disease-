import React from 'react';
import { Link } from 'react-router-dom';
import { Farm } from '../../types/farmer';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Calendar, Layers, ChevronRight, ScanLine } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FarmCardProps {
  farm: Farm;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const { t } = useLanguage();

  return (
    <div className="card flex flex-col justify-between hover:border-agri-300 transition-all group">
      <div>
        {/* Card Header: Crop Name & Badges */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-agri-100 px-2.5 py-0.5 text-xs font-extrabold text-agri-800">
                {farm.crop.name}
              </span>
              {farm.crop.variety && (
                <span className="text-xs text-slate-500 font-medium truncate max-w-[120px]">
                  ({farm.crop.variety})
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 group-hover:text-agri-700 transition-colors">
              {farm.name}
            </h3>
          </div>

          <RiskBadge level={farm.crop.currentRisk} size="sm" />
        </div>

        {/* Location & Details Grid */}
        <div className="py-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-agri-600 shrink-0" />
            <span className="truncate">
              {farm.village}, {farm.taluka}, {farm.district}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200/70">
              <Layers className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.farms.area}</p>
                <p className="text-xs font-bold text-slate-800">{farm.areaAcres} Acres</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200/70">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.farms.cropStage}</p>
                <p className="text-xs font-bold text-slate-800">{farm.crop.stage}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">{t.farms.healthStatus}:</span>
            <StatusBadge status={farm.crop.health} size="sm" />
          </div>

          {farm.lastScanDate && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <span>{t.farms.lastScan}:</span>
              <span className="font-medium text-slate-700">
                {new Date(farm.lastScanDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <Link
          to={`/farmer/scan?farmId=${farm.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-agri-50 px-3 py-2 text-xs font-bold text-agri-800 hover:bg-agri-100 transition-colors"
        >
          <ScanLine className="h-3.5 w-3.5 text-agri-700" />
          <span>Scan Plot</span>
        </Link>

        <Link
          to={`/farmer/farms/${farm.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-900 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t.farms.viewDetails}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
