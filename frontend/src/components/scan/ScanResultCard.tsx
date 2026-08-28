import React, { useState } from 'react';
import { CropScan } from '../../types/scan';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../context/LanguageContext';
import { scanService } from '../../services/scanService';
import {
  FileText,
  UserCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { RequestOfficerModal } from '../common/RequestOfficerModal';

interface ScanResultCardProps {
  scan: CropScan;
  onResetScan?: () => void;
  isFullPageView?: boolean;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  scan,
  onResetScan,
  isFullPageView = false,
}) => {
  const { t } = useLanguage();
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await scanService.downloadReportPdf(scan);
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const { result } = scan;

  return (
    <div className="space-y-6">
      {/* Top Main Result Banner */}
      <div className="card border-stone-200 overflow-hidden p-0 bg-white">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-agri-800 to-agri-950 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {t.scan.resultTitle}
              </h2>
              <p className="text-xs text-agri-200">
                {scan.cropName} • {scan.farmName} • {new Date(scan.scanDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RiskBadge level={result.riskLevel} size="md" />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Diagnostic Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Scanned Image Preview */}
            <div className="md:col-span-4 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center max-h-64 sm:max-h-72">
              <img
                src={scan.imageUrl}
                alt={`Scanned ${scan.cropName} leaf`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Core Diagnosis Details */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-agri-700">
                  Detected Condition / Pathogen
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {result.disease}
                </h3>
              </div>

              {/* Confidence Score Bar */}
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-slate-700">{t.scan.confidence}</span>
                  <span className="font-extrabold text-agri-800 text-base">{result.confidence}% Match</span>
                </div>
                <div className="h-3 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-agri-500 to-agri-700 transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Based on leaf spectral color pattern and lesion morphology neural network match.
                </p>
              </div>

              {/* Pathogen Biology Explanation */}
              <p className="text-sm text-slate-700 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Symptoms & Warning Signs */}
          <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-200/80 space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>{t.scan.symptoms}</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.warning_signs.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Management Steps */}
          <div className="rounded-2xl bg-emerald-50/50 p-5 border border-emerald-200/80 space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-agri-700" />
              <span>{t.scan.recommendation}</span>
            </h4>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              {result.treatment}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700">Cultural & Preventive Practices:</span>
              <ul className="mt-1.5 space-y-1.5">
                {result.preventive_measures.map((pm, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-agri-700 mt-1.5 shrink-0" />
                    <span>{pm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chemical & Safety Advisory */}
          <div className="rounded-2xl bg-stone-100/80 p-5 border border-stone-200 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldAlert className="h-4 w-4 text-slate-700" />
              <span>{t.scan.safetyNote}</span>
            </div>
            {result.active_ingredient && (
              <p className="text-slate-700">
                <strong>Approved Active Ingredient:</strong> {result.active_ingredient}
              </p>
            )}
            {result.application && (
              <p className="text-slate-700">
                <strong>Application Guidance:</strong> {result.application}
              </p>
            )}
            <p className="text-slate-600 italic">
              {result.safety_note} Never mix unauthorized chemical combinations. Always adhere to pre-harvest intervals.
            </p>
          </div>

          {/* Officer Assistance Status (if already requested) */}
          {scan.officerAssistanceRequested && (
            <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200 flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-blue-900">Officer Assistance Requested</h5>
                <p className="text-xs text-blue-800 mt-0.5">
                  {scan.officerNotes || 'Your request has been forwarded to the Taluka Agricultural Extension Officer.'}
                </p>
              </div>
            </div>
          )}

          {/* Mandatory AI Prediction Disclaimer Banner */}
          <div className="rounded-2xl bg-amber-100/80 p-4 border border-amber-300 text-xs text-amber-950 flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              <strong>Advisory Notice:</strong> {t.scan.disclaimerBanner} Consult your local agricultural officer if symptoms persist or if you have any questions regarding chemical doses.
            </p>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOfficerModalOpen(true)}
                className="btn-primary text-sm sm:text-base py-3 px-5 inline-flex items-center justify-center gap-2"
              >
                <UserCheck className="h-5 w-5" />
                <span>{t.scan.requestOfficer}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="btn-secondary text-sm sm:text-base py-3 px-5 inline-flex items-center justify-center gap-2"
              >
                <FileText className="h-5 w-5 text-slate-600" />
                <span>{isDownloading ? 'Generating PDF...' : t.scan.downloadReport}</span>
              </button>
            </div>

            {onResetScan && (
              <button
                type="button"
                onClick={onResetScan}
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-agri-800 hover:text-agri-950 py-3 px-4 rounded-xl hover:bg-agri-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t.scan.newScan}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Officer Modal */}
      <RequestOfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        farmId={scan.farmId}
        farmName={scan.farmName}
        cropName={scan.cropName}
        scanId={scan.id}
      />
    </div>
  );
};
