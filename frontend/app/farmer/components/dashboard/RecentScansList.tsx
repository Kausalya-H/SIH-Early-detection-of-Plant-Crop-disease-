import React from 'react';
import { Link } from 'react-router-dom';
import { CropScan } from '../../types/scan';
import { RiskBadge } from '../common/RiskBadge';
import { ArrowRight, Calendar, FileText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RecentScansListProps {
  scans: CropScan[];
  limit?: number;
}

export const RecentScansList: React.FC<RecentScansListProps> = ({ scans, limit = 3 }) => {
  const { t } = useLanguage();
  const displayed = scans.slice(0, limit);

  if (scans.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-sm text-slate-500">No scans recorded yet.</p>
        <Link to="/farmer/scan" className="btn-primary mt-4 text-xs">
          Scan Your First Crop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{t.dashboard.recentScans}</h3>
        <Link
          to="/farmer/reports"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-800"
        >
          <span>{t.dashboard.viewAllScans}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayed.map((scan) => (
          <Link
            key={scan.id}
            to={`/farmer/scan/${scan.id}`}
            className="group card flex flex-col justify-between hover:border-agri-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                  {scan.cropName}
                </div>
                <RiskBadge level={scan.result.riskLevel} size="sm" />
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-agri-700 transition-colors line-clamp-1">
                {scan.result.disease}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{scan.farmName}</p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(scan.scanDate).toLocaleDateString()}</span>
                </div>
                <div className="font-semibold text-slate-700">
                  {scan.result.confidence}% Match
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-agri-700 group-hover:text-agri-800">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                View Full Report
              </span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
