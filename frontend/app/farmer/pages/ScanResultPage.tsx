import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { scanService } from '../services/scanService';
import { CropScan } from '../types/scan';
import { PageHeader } from '../components/common/PageHeader';
import { ScanResultCard } from '../components/scan/ScanResultCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ArrowLeft, ScanLine } from 'lucide-react';

export const ScanResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [scan, setScan] = useState<CropScan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScan = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const found = await scanService.getScanById(id);
        if (found) {
          setScan(found);
        } else {
          setError('Crop scan report not found.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load crop scan report.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading crop scan diagnostic report..." count={3} />;
  }

  if (error || !scan) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/farmer/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Reports</span>
        </button>
        <ErrorState
          message={error || 'Report not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-agri-700 hover:text-agri-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Reports</span>
        </button>

        <Link
          to="/farmer/scan"
          className="btn-primary text-xs sm:text-sm py-2 px-4 inline-flex items-center gap-1.5"
        >
          <ScanLine className="h-4 w-4" />
          <span>New Scan</span>
        </Link>
      </div>

      <ScanResultCard scan={scan} isFullPageView={true} />
    </div>
  );
};
