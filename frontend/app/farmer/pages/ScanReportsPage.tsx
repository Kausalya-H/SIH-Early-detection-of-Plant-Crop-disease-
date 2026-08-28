import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scanService } from '../services/scanService';
import { CropScan } from '../types/scan';
import { PageHeader } from '../components/common/PageHeader';
import { RiskBadge } from '../components/common/RiskBadge';
import { SearchInput } from '../components/common/SearchInput';
import { FilterBar } from '../components/common/FilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ScanLine, Calendar, ChevronRight, UserCheck } from 'lucide-react';

export const ScanReportsPage: React.FC = () => {
  const [scans, setScans] = useState<CropScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  useEffect(() => {
    const fetchScans = async () => {
      setIsLoading(true);
      try {
        const data = await scanService.getScans();
        setScans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScans();
  }, []);

  const crops = ['ALL', 'Tomato', 'Chilli', 'Groundnut', 'Rice'];
  const cropFilterOptions = crops.map((c) => ({
    id: c,
    label: c === 'ALL' ? 'All Crops' : c,
    count: c === 'ALL' ? scans.length : scans.filter((s) => s.cropName === c).length,
  }));

  const riskFilterOptions = [
    { id: 'ALL', label: 'All Risk Levels' },
    { id: 'CRITICAL', label: 'Critical Risk' },
    { id: 'HIGH', label: 'High Risk' },
    { id: 'MODERATE', label: 'Moderate Risk' },
    { id: 'LOW', label: 'Low Risk' },
  ];

  const filteredScans = scans.filter((scan) => {
    const matchesQuery =
      searchQuery === '' ||
      scan.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.result.disease.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = selectedCrop === 'ALL' || scan.cropName === selectedCrop;
    const matchesRisk = selectedRisk === 'ALL' || scan.result.riskLevel === selectedRisk;

    return matchesQuery && matchesCrop && matchesRisk;
  });

  if (isLoading) {
    return <LoadingState message="Loading scan reports archive..." count={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan History & Crop Reports"
        subtitle="Review past AI diagnostic screenings, pathogen symptoms, and officer consultation notes"
        action={
          <Link
            to="/farmer/scan"
            className="btn-primary text-xs sm:text-sm py-2.5 px-4 inline-flex items-center gap-2"
          >
            <ScanLine className="h-4 w-4" />
            <span>New Crop Scan</span>
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reports by crop, farm name, or disease..."
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <FilterBar
            options={cropFilterOptions}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />

          <FilterBar
            options={riskFilterOptions}
            selectedId={selectedRisk}
            onSelect={setSelectedRisk}
          />
        </div>
      </div>

      {/* Reports Table / Card List */}
      {filteredScans.length === 0 ? (
        <EmptyState
          title="No crop scans found"
          description="No diagnostic reports match your current filter criteria. Scan a crop to analyze its health."
          actionText="Start New Scan"
          onAction={() => (window.location.href = '/farmer/scan')}
        />
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => (
            <Link
              key={scan.id}
              to={`/farmer/scan/${scan.id}`}
              className="card flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-agri-300 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200">
                  <img
                    src={scan.imageUrl}
                    alt={scan.cropName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
                      {scan.cropName}
                    </span>
                    <RiskBadge level={scan.result.riskLevel} size="sm" />
                    {scan.officerAssistanceRequested && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                        <UserCheck className="h-3 w-3" />
                        Officer Advisory
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-agri-700 transition-colors">
                    {scan.result.disease}
                  </h3>

                  <p className="text-xs text-slate-500">{scan.farmName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Confidence</span>
                  <span className="text-sm font-extrabold text-agri-800">
                    {scan.result.confidence}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scan Date</span>
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(scan.scanDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-agri-700 group-hover:translate-x-1 transition-transform">
                  <span className="hidden sm:inline">View Report</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
