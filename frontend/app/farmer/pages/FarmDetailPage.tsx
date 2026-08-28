import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { scanService } from '../services/scanService';
import { Farm } from '../types/farmer';
import { CropScan } from '../types/scan';
import { FarmDetailOverview } from '../components/farms/FarmDetailOverview';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { RequestOfficerModal } from '../components/common/RequestOfficerModal';
import { ArrowLeft } from 'lucide-react';

export const FarmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [scans, setScans] = useState<CropScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [farmData, scansData] = await Promise.all([
          farmService.getFarmById(id),
          scanService.getScans(),
        ]);
        if (farmData) {
          setFarm(farmData);
          setScans(scansData);
        } else {
          setError('Farm plot not found.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load farm details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading farm plot details..." count={3} />;
  }

  if (error || !farm) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/farmer/farms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Farms</span>
        </button>
        <ErrorState
          message={error || 'Farm not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/farmer/farms')}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Farms</span>
      </button>

      <FarmDetailOverview
        farm={farm}
        scans={scans}
        onRequestOfficer={() => setIsOfficerModalOpen(true)}
      />

      <RequestOfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        farmId={farm.id}
        farmName={farm.name}
        cropName={farm.crop.name}
      />
    </div>
  );
};
