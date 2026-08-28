import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { farmService } from '../services/farmService';
import { scanService } from '../services/scanService';
import { Farm } from '../types/farmer';
import { CropScan } from '../types/scan';
import { PageHeader } from '../components/common/PageHeader';
import { ScanUploader } from '../components/scan/ScanUploader';
import { ScanLoading } from '../components/scan/ScanLoading';
import { ScanResultCard } from '../components/scan/ScanResultCard';
import { LoadingState } from '../components/common/LoadingState';
import { Sparkles, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScanCropPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm_01');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<CropScan | null>(null);

  useEffect(() => {
    const initFarms = async () => {
      setIsLoadingFarms(true);
      try {
        const data = await farmService.getFarms();
        setFarms(data);

        // Pre-fill from query params if available
        const qFarmId = searchParams.get('farmId');
        const qCrop = searchParams.get('crop');

        if (qFarmId && data.some((f) => f.id === qFarmId)) {
          setSelectedFarmId(qFarmId);
          const found = data.find((f) => f.id === qFarmId);
          if (found) setSelectedCrop(found.crop.name);
        } else if (data.length > 0) {
          setSelectedFarmId(data[0].id);
          setSelectedCrop(data[0].crop.name);
        }

        if (qCrop) setSelectedCrop(qCrop);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingFarms(false);
      }
    };
    initFarms();
  }, [searchParams]);

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const result = await scanService.analyzeCropImage({
        file: selectedFile,
        crop: selectedCrop,
        farmId: selectedFarmId,
      });
      setScanResult(result);
    } catch (err) {
      console.error('Scan analysis error', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setSelectedFile(null);
  };

  if (isLoadingFarms) {
    return <LoadingState message="Preparing AI scanning engine..." count={2} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.scan.title}
        subtitle={t.scan.subtitle}
        badge={
          <span className="inline-flex items-center gap-1 rounded-full bg-agri-100 px-3 py-1 text-xs font-extrabold text-agri-800 border border-agri-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI Assisted (SIH26131)
          </span>
        }
        action={
          <Link
            to="/farmer/reports"
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 inline-flex items-center gap-2"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span>Scan History</span>
          </Link>
        }
      />

      {/* 3-Step Interactive Scan Workflow */}
      {isAnalyzing ? (
        /* Step 2: Analysis Loading State */
        <ScanLoading />
      ) : scanResult ? (
        /* Step 3: Scan Diagnostic Result */
        <ScanResultCard scan={scanResult} onResetScan={handleReset} />
      ) : (
        /* Step 1: Upload / Capture State */
        <ScanUploader
          farms={farms}
          selectedFarmId={selectedFarmId}
          onSelectFarmId={setSelectedFarmId}
          selectedCrop={selectedCrop}
          onSelectCrop={setSelectedCrop}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
};
