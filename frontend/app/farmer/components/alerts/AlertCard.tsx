import React from 'react';
import { CropAlert } from '../../types/alert';
import { RiskBadge } from '../common/RiskBadge';
import {
  AlertOctagon,
  AlertTriangle,
  CloudRain,
  UserCheck,
  BookOpen,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface AlertCardProps {
  alert: CropAlert;
  onMarkRead?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkRead }) => {
  const categoryIcons: Record<string, React.ReactNode> = {
    DISEASE_OUTBREAK: <AlertOctagon className="h-5 w-5 text-red-600" />,
    PEST_WARNING: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    PEST_SURGE: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    WEATHER_RISK: <CloudRain className="h-5 w-5 text-blue-600" />,
    WEATHER_WARNING: <CloudRain className="h-5 w-5 text-blue-600" />,
    OFFICER_MESSAGE: <UserCheck className="h-5 w-5 text-agri-700" />,
    OFFICER_ADVISORY: <UserCheck className="h-5 w-5 text-agri-700" />,
    ADVISORY_UPDATE: <BookOpen className="h-5 w-5 text-purple-600" />,
  };

  const isCritical = alert.severity === 'CRITICAL';

  return (
    <div
      className={`card border transition-all ${
        isCritical
          ? 'border-red-300 bg-red-50/40 hover:border-red-400'
          : alert.isRead
          ? 'border-stone-200 bg-white opacity-85'
          : 'border-agri-200 bg-white hover:border-agri-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-stone-100 p-2.5 shrink-0 mt-0.5">
            {categoryIcons[alert.category] || <AlertTriangle className="h-5 w-5 text-amber-600" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <RiskBadge level={alert.severity} size="sm" />
              <span className="text-xs font-semibold text-slate-500">
                {alert.region || alert.taluka || 'Baramati'} • {alert.district}
              </span>
              {!alert.isRead && (
                <span className="rounded-full bg-agri-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  New
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {alert.title}
            </h3>
          </div>
        </div>

        {onMarkRead && !alert.isRead && (
          <button
            type="button"
            onClick={() => onMarkRead(alert.id)}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-600 transition-colors"
            title="Mark as read"
            aria-label="Mark alert as read"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="py-3 space-y-3 text-xs sm:text-sm text-slate-700">
        <p className="leading-relaxed">{alert.description || alert.message}</p>

        {/* Action Required Box */}
        <div className="rounded-xl bg-amber-50/90 p-3 border border-amber-200/90 text-xs text-amber-950 font-medium space-y-1">
          <span className="font-bold text-amber-900 block">Recommended Action for Farmers:</span>
          <span>{alert.actionRequired}</span>
        </div>

        {/* Affected crops */}
        {alert.affectedCrops && alert.affectedCrops.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Target Crops:</span>
            <div className="flex flex-wrap gap-1.5">
              {alert.affectedCrops.map((crop) => (
                <span
                  key={crop}
                  className="rounded-md bg-stone-100 px-2 py-0.5 font-semibold text-slate-700"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{alert.createdAt || alert.issueDate}</span>
        </div>
        <span className="truncate max-w-[200px] italic">{alert.source || alert.issuedBy}</span>
      </div>
    </div>
  );
};
