'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  RiskBadge,
} from '@/components/shared';
import {
  ScanIcon,
  UploadIcon,
  XIcon,
  ActivityIcon,
  ShieldIcon,
  AlertIcon,
  CheckIcon,
  ReportIcon,
} from '@/components/shared/ui/Icons';
import { predictDisease, downloadDiseaseReportPdf, triggerBlobDownload } from '@/lib/api/disease';
import { DiseasePrediction, RiskLevel } from '@/types';
import { useAuth } from '@/context';

const SUPPORTED_CROPS = [
  { id: 'Tomato', name: 'Tomato (टमाटर / தக்காளி / టమోటా)', defaultDisease: 'Early Blight' },
  { id: 'Chilli', name: 'Chilli (मिर्च / மிளகாய் / మిరప)', defaultDisease: 'Bacterial Leaf Spot' },
  { id: 'Groundnut', name: 'Groundnut (मूंगफली / நிலக்கடலை / వేరుశనగ)', defaultDisease: 'Early Leaf Spot' },
  { id: 'Rice', name: 'Rice / Paddy (धान / அரிசி / వరి)', defaultDisease: 'Rice Blast' },
  { id: 'Potato', name: 'Potato (आलू / உருளைக்கிழங்கு / బంగాళాదుంప)' },
  { id: 'Wheat', name: 'Wheat (गेहूं / கோதுமை / గోధుమ)' },
  { id: 'Corn', name: 'Corn / Maize (मक्का / மக்காச்சோளம் / మొక్కజొన్న)' },
  { id: 'Cotton', name: 'Cotton (कपास / பருத்தி / పత్తి)' },
  { id: 'Pepper', name: 'Bell Pepper (शिमला मिर्च / குடைமிளகாய்)' },
  { id: 'Apple', name: 'Apple (सेब / ஆப்பிள்)' },
  { id: 'Grape', name: 'Grape (अंगूर / திராட்சை / ద్రాక్ష)' },
];

export default function FarmerDiagnosePage() {
  const { user } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<DiseasePrediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPredictionResult(null);
      setErrorMessage(null);
      setPdfSuccessMessage(null);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPredictionResult(null);
    setErrorMessage(null);
    setPdfSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or capture a leaf photo first.');
      return;
    }

    setIsPredicting(true);
    setErrorMessage(null);
    setPdfSuccessMessage(null);

    try {
      const result = await predictDisease({
        file: selectedFile,
        crop: selectedCrop,
      });

      setPredictionResult(result);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to diagnose leaf image. Please ensure backend service is running.';
      setErrorMessage(msg);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedFile) {
      setErrorMessage('Please provide a crop image before generating the PDF report.');
      return;
    }

    setIsDownloadingPdf(true);
    setPdfSuccessMessage(null);
    setErrorMessage(null);

    try {
      const farmerName = user?.name || 'Rameshwar Rao';
      const phone = user?.phone || '+91 98765 43210';
      const location = user?.jurisdiction
        ? `${user.jurisdiction.taluk || ''}, ${user.jurisdiction.district || ''}, ${user.jurisdiction.state}`
        : 'Nashik, Maharashtra';

      const blob = await downloadDiseaseReportPdf({
        file: selectedFile,
        crop: selectedCrop,
        farmerName,
        phone,
        location,
      });

      const fileName = `${selectedCrop.toLowerCase()}_health_report_${new Date().toISOString().slice(0, 10)}.pdf`;
      triggerBlobDownload(blob, fileName);
      setPdfSuccessMessage(`Official Health Report downloaded: ${fileName}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to generate PDF crop report. Please check backend service.';
      setErrorMessage(msg);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const mapSeverityToRiskLevel = (severity?: string): RiskLevel => {
    if (!severity) return 'MODERATE';
    const s = severity.toUpperCase();
    if (s.includes('CRITICAL')) return 'CRITICAL';
    if (s.includes('HIGH')) return 'HIGH';
    if (s.includes('LOW')) return 'LOW';
    return 'MODERATE';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ScanIcon className="w-6 h-6 text-emerald-300" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              AI Leaf Diagnosis & Disease Detection Desk
            </h1>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            Upload or capture clear field photographs of affected plant leaves. The KrishiRakshak Vision model identifies pathogen infections, calculates confidence, and prescribes ICAR-approved treatments.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-700/60 text-xs shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-200">Vision Model: <strong>v2.4.1 Active</strong></span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
          <AlertIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Diagnosis Error</p>
            <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* PDF Success Alert */}
      {pdfSuccessMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
          <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">PDF Download Initiated</p>
            <p className="text-emerald-700">{pdfSuccessMessage}</p>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid: Upload & Inputs on Left, AI Prediction & Advisory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop Selection & Image Upload */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white border-2 border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                1. Select Crop & Upload Leaf Photo
              </CardTitle>
              <CardDescription>
                Provide crop species and clear photo of visible leaf spots or discoloration.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Crop Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Crop Species *
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-900 font-medium cursor-pointer"
                >
                  {SUPPORTED_CROPS.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Dropzone / Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Leaf Photograph *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-emerald-500 bg-slate-950 flex flex-col items-center">
                    <div className="relative w-full h-56">
                      <Image
                        src={previewUrl}
                        alt="Uploaded leaf preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Remove image"
                      aria-label="Remove image"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                    <div className="w-full bg-slate-900/90 text-slate-300 px-3 py-1.5 text-[11px] flex items-center justify-between border-t border-slate-800">
                      <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                      <span className="font-mono text-emerald-400">
                        {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5"
                  >
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-800">
                      <UploadIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload or take a leaf photo
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Supported: JPG, PNG, WebP up to 10MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs pointer-events-none"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleDiagnose}
                  disabled={!selectedFile || isPredicting}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isPredicting ? (
                    <>
                      <ActivityIcon className="w-4 h-4 animate-spin" />
                      <span>Scanning Leaf with Vision Transformer...</span>
                    </>
                  ) : (
                    <>
                      <ScanIcon className="w-4 h-4" />
                      <span>Run AI Leaf Diagnosis</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Best Practice Guidelines */}
          <Card className="bg-slate-50 border border-slate-200 text-xs">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-slate-800">
                Photo Best Practices for High Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <span>Ensure bright natural daylight without heavy shadows or glare.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <span>Keep camera in sharp focus on the diseased lesion or spot area.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <span>Isolate single affected leaf against neutral field background.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Diagnosis Results & Agronomic Treatment Plan */}
        <div className="lg:col-span-7 space-y-4">
          {predictionResult ? (
            <Card className="bg-white border-2 border-emerald-500 shadow-md animate-fadeIn">
              <CardHeader
                action={
                  <div className="flex items-center gap-2">
                    <RiskBadge
                      level={mapSeverityToRiskLevel(predictionResult.severity || predictionResult.riskLevel)}
                      size="md"
                    />
                    <Badge variant="primary" size="sm">
                      {Math.round(predictionResult.confidence * (predictionResult.confidence <= 1 ? 100 : 1))}% Confidence
                    </Badge>
                  </div>
                }
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-100 text-emerald-800">
                    <ShieldIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-950">
                      Diagnosis: {predictionResult.disease || predictionResult.diseaseName || 'Healthy / Early Symptom'}
                    </CardTitle>
                    <CardDescription className="text-emerald-800 font-semibold">
                      Crop: {predictionResult.crop} • Severity: {predictionResult.severity || 'Moderate'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Confidence Bar */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700">Neural Network Confidence Score:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {Math.round(predictionResult.confidence * (predictionResult.confidence <= 1 ? 100 : 1))}% Match
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          predictionResult.confidence * (predictionResult.confidence <= 1 ? 100 : 1)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Warning Signs */}
                {predictionResult.warning_signs && predictionResult.warning_signs.length > 0 && (
                  <div className="space-y-2 p-3.5 rounded-lg bg-amber-50/70 border border-amber-200">
                    <p className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                      Identified Warning Signs & Symptoms:
                    </p>
                    <ul className="space-y-1.5 text-xs text-amber-900">
                      {predictionResult.warning_signs.map((sign, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Agronomist Advice */}
                {predictionResult.advice && (
                  <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Agronomist Field Advice:
                    </p>
                    <p className="text-slate-700 leading-relaxed">{predictionResult.advice}</p>
                  </div>
                )}

                {/* Treatment & Active Ingredient */}
                {(predictionResult.treatment || predictionResult.active_ingredient) && (
                  <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                      ICAR Recommended Treatment Protocol:
                    </p>
                    {predictionResult.treatment && (
                      <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                        {predictionResult.treatment}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-[11px]">
                      {predictionResult.active_ingredient && (
                        <div>
                          <span className="font-bold text-emerald-900">Active Ingredient: </span>
                          <span className="text-emerald-950 font-mono">
                            {predictionResult.active_ingredient}
                          </span>
                        </div>
                      )}
                      {predictionResult.application && (
                        <div>
                          <span className="font-bold text-emerald-900">Application: </span>
                          <span className="text-emerald-950">{predictionResult.application}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Safety Note */}
                {predictionResult.safety_note && (
                  <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                      Safety & Pre-Harvest Interval (PHI):
                    </p>
                    <p className="text-[11px] text-rose-900 leading-relaxed">
                      {predictionResult.safety_note}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white text-xs gap-2 cursor-pointer shadow-xs"
                >
                  {isDownloadingPdf ? (
                    <>
                      <ActivityIcon className="w-4 h-4 animate-spin" />
                      <span>Generating Official PDF...</span>
                    </>
                  ) : (
                    <>
                      <ReportIcon className="w-4 h-4" />
                      <span>Download Official PDF Health Report</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    handleClearImage();
                  }}
                  className="w-full sm:w-auto text-xs"
                >
                  Scan Another Leaf
                </Button>
              </CardFooter>
            </Card>
          ) : (
            /* Empty State when waiting for diagnosis */
            <Card className="bg-white border-2 border-slate-200 border-dashed shadow-xs h-full min-h-[380px] flex flex-col justify-center items-center text-center p-8">
              <div className="max-w-md space-y-4">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-700 w-fit mx-auto border border-emerald-200">
                  <ScanIcon className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">
                    Awaiting Leaf Photo for Analysis
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload a leaf photograph on the left panel and click &ldquo;Run AI Leaf Diagnosis&rdquo; to receive immediate pathogen identification, severity scoring, and spray recommendations.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    54 Diseases Trained
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    ICAR Knowledge Base
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    Instant PDF Reports
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
