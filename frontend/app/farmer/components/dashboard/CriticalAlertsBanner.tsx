import React from 'react';
import { Link } from 'react-router-dom';
import { CropAlert } from '../../types/alert';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface CriticalAlertsBannerProps {
  alerts: CropAlert[];
}

export const CriticalAlertsBanner: React.FC<CriticalAlertsBannerProps> = ({ alerts }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');
  if (criticalAlerts.length === 0) return null;

  const topAlert = criticalAlerts[0];

  return (
    <div className="rounded-2xl border border-red-300 bg-red-50/90 p-4 sm:p-5 text-red-950 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-red-100 p-2.5 text-red-700 shrink-0 mt-0.5">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <RiskBadge level={topAlert.severity} size="sm" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                {topAlert.region} • {topAlert.district}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-red-950 leading-snug">
              {topAlert.title}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-red-900/90 line-clamp-2">
              {topAlert.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-end sm:justify-start">
          <Link
            to="/farmer/alerts"
            className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-red-800 transition-colors"
          >
            <span>View Advisory Action</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
