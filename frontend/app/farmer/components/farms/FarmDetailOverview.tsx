import React from 'react';
import { Farm } from '../../types/farmer';
import { CropScan } from '../../types/scan';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Layers,
  ScanLine,
  FileText,
  UserCheck,
} from 'lucide-react';

interface FarmDetailOverviewProps {
  farm: Farm;
  scans: CropScan[];
  onRequestOfficer: () => void;
}

export const FarmDetailOverview: React.FC<FarmDetailOverviewProps> = ({
  farm,
  scans,
  onRequestOfficer,
}) => {
  const farmScans = scans.filter((s) => s.farmId === farm.id);

  return (
    <div className="space-y-6">
      {/* Farm Overview Card */}
      <div className="card bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-agri-100 px-3 py-1 text-xs font-extrabold text-agri-900 uppercase">
                {farm.crop.name} Field
              </span>
              {farm.plotNumber && (
                <span className="text-xs text-slate-500 font-mono">
                  {farm.plotNumber}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {farm.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-agri-600 shrink-0" />
              <span>{farm.village}, Taluka {farm.taluka}, District {farm.district}, {farm.state}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={farm.crop.health} size="md" />
            <RiskBadge level={farm.crop.currentRisk} size="md" />
          </div>
        </div>

        {/* Agricultural Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase">Acreage</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{farm.areaAcres} Acres</p>
          </div>

          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase">Crop Stage</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{farm.crop.stage}</p>
          </div>

          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase">Irrigation System</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{farm.irrigationType || 'Drip'}</p>
          </div>

          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase">Sowing Date</span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {new Date(farm.crop.sowingDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={`/farmer/scan?farmId=${farm.id}&crop=${farm.crop.name}`}
            className="btn-primary text-sm py-3 px-5 inline-flex items-center gap-2"
          >
            <ScanLine className="h-4 w-4" />
            <span>Scan This Plot Now</span>
          </Link>

          <button
            type="button"
            onClick={onRequestOfficer}
            className="btn-secondary text-sm py-3 px-5 inline-flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4 text-agri-700" />
            <span>Request Officer Inspection</span>
          </button>
        </div>
      </div>

      {/* Historical Scans Timeline for this Farm */}
      <div className="card bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Scan History & Health Timeline ({farmScans.length})
          </h3>
        </div>

        {farmScans.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No scans recorded yet for this farm plot.
          </div>
        ) : (
          <div className="space-y-3">
            {farmScans.map((scan) => (
              <div
                key={scan.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-stone-200 hover:border-agri-300 transition-colors bg-stone-50/50"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                    <img
                      src={scan.imageUrl}
                      alt={scan.cropName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {scan.result.disease}
                      </span>
                      <RiskBadge level={scan.result.riskLevel} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scanned on {new Date(scan.scanDate).toLocaleDateString()} • {scan.result.confidence}% match
                    </p>
                  </div>
                </div>

                <Link
                  to={`/farmer/scan/${scan.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-700 hover:text-agri-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Report</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
