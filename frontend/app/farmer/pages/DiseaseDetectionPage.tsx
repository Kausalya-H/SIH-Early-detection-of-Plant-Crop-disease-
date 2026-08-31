import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { RiskBadge } from '../components/common/RiskBadge';
import { farmService } from '../services/farmService';
import { diagnosisService } from '../services/diagnosisService';
import { useAuth } from '../context/AuthContext';
import { Farm } from '../types/farmer';
import { DiagnosisRecord, RiskLevel } from '../types/disease';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileDown,
  ShieldCheck,
  Info,
  Check,
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('farm_01');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [result, setResult] = useState<DiagnosisRecord | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    farmService.getFarms().then((data) => {
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarmId(data[0].id);
        setSelectedCrop(data[0].crop.name);
      }
    });
  }, []);

  const sampleImages: { label: string; crop: string; url: string }[] = []

  const handleSelectSample = async (sample: { label: string; crop: string; url: string }) => {
    setPreviewImage(sample.url);
    setSelectedCrop(sample.crop);
    setApiError(null);
    setResult(null);
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      setSelectedFile(blob);
    } catch {
      const emptyBlob = new Blob(['sample-crop-image'], { type: 'image/jpeg' });
      setSelectedFile(emptyBlob);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setSelectedFile(file);
      setApiError(null);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile && !previewImage) return;

    setIsAnalyzing(true);
    setResult(null);
    setApiError(null);

    // Visual step feedback
    setAnalyzingStep(1);
    await new Promise((r) => setTimeout(r, 400));
    setAnalyzingStep(2);

    const selectedFarm = farms.find((f) => f.id === selectedFarmId);
    const farmName = selectedFarm?.name || 'Main Plot';

    let backendData = null;

    // 1. Try real FastAPI backend POST /disease/predict
    if (selectedFile) {
      const farmLat = selectedFarm ? (selectedFarm as any).lat || (selectedFarm as any).latitude || null : null;
      const farmLng = selectedFarm ? (selectedFarm as any).lng || (selectedFarm as any).longitude || null : null;
      const { data, error } = await diagnosisService.predictDisease(selectedFile, selectedCrop, farmLat ?? undefined, farmLng ?? undefined);
      if (data) {
        backendData = data;
      } else if (error) {
        console.warn('Backend /disease/predict error, falling back to local knowledge base:', error);
        setApiError(`Backend Notice: ${error} (using offline agronomic knowledge base)`);
      }
    }

    setAnalyzingStep(3);
    await new Promise((r) => setTimeout(r, 300));

    if (backendData) {
      // Normalize confidence to percentage
      const normalizedConfidence =
        backendData.confidence <= 1 ? +(backendData.confidence * 100).toFixed(1) : +backendData.confidence.toFixed(1);

      let computedRisk: RiskLevel = 'MODERATE';
      if (backendData.severity?.toLowerCase() === 'high') computedRisk = 'HIGH';
      else if (backendData.severity?.toLowerCase() === 'low') computedRisk = 'LOW';

      const record = await diagnosisService.addDiagnosis({
        farmId: selectedFarmId,
        farmName,
        cropName: backendData.crop || selectedCrop,
        imageUrl: previewImage || '',
        diseaseDetected: backendData.disease,
        confidence: normalizedConfidence,
        riskLevel: computedRisk,
        severity: backendData.severity,
        warning_signs: backendData.warning_signs || [],
        symptoms: backendData.warning_signs && backendData.warning_signs.length > 0 ? backendData.warning_signs : [backendData.disease],
        advice: backendData.advice,
        treatmentText: backendData.treatment,
        active_ingredient: backendData.active_ingredient,
        application: backendData.application,
        safety_note: backendData.safety_note,
        message: backendData.message,
        treatment: {
          chemicalControl: backendData.active_ingredient
            ? [`${backendData.active_ingredient} — ${backendData.application || 'Follow label instructions'}`]
            : [],
          biologicalControl: ['Follow integrated pest & disease management protocol'],
          culturalPractices: backendData.advice ? [backendData.advice] : [],
          safetyPrecautions: backendData.safety_note ? [backendData.safety_note] : [],
        },
        status: 'PENDING',
        isLiveBackendResult: true,
      });

      setIsAnalyzing(false);
      setResult(record);
    } else {
      // 2. Fallback when backend is not available
      const record = await diagnosisService.addDiagnosis({
        farmId: selectedFarmId,
        farmName,
        cropName: selectedCrop,
        imageUrl: previewImage || '',
        diseaseDetected: 'Could not connect to backend. Ensure FastAPI is running at http://localhost:8000.',
        confidence: 0,
        riskLevel: 'LOW' as RiskLevel,
        symptoms: ['Backend server not reachable'],
        advice: 'Start the backend server and try again.',
        treatmentText: '',
        active_ingredient: '',
        application: '',
        safety_note: '',
        treatment: { chemicalControl: [], biologicalControl: [], culturalPractices: [], safetyPrecautions: [] },
        status: 'PENDING',
        isLiveBackendResult: false,
      });

      setIsAnalyzing(false);
      setResult(record);
    }
  };

  const handleDownloadPdfReport = async () => {
    if (!selectedFile) {
      alert('Please upload an image first to generate the official report.');
      return;
    }

    setIsDownloadingPdf(true);
    const locationString = user ? [user.village, user.taluka, user.district, user.state].filter(Boolean).join(', ') || user.location || 'Location not set' : 'Location not set';
    const selectedFarm = farms.find((f) => f.id === selectedFarmId);
    const reportLat = selectedFarm?.lat || null;
    const reportLng = selectedFarm?.lng || null;

    const { error } = await diagnosisService.generateReport({
      file: selectedFile,
      crop: selectedCrop,
      farmer_name: user?.name || 'Ramesh Patil',
      phone: user?.phone || '+91 98220 14321',
      location: locationString,
      lat: reportLat ?? undefined,
      lng: reportLng ?? undefined,
      filename: `${selectedCrop}_crop_health_report.pdf`,
    });

    setIsDownloadingPdf(false);

    if (error) {
      alert(`Could not generate PDF from backend (${error}). Ensure the FastAPI server is running at http://localhost:8000.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Crop Disease Detection"
        subtitle="Upload or capture a leaf photo for instant computer vision pathology diagnosis & treatment recommendations"
        badge={
          <span className="rounded-full bg-agri-100 px-3 py-1 text-xs font-bold text-agri-800 border border-agri-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-agri-700" />
            <span>FastAPI /disease/predict Integration</span>
          </span>
        }
      />

      {apiError && (
        <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}
      {(result as any)?.cropValidation?.status === 'mismatch' && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-400 p-4 text-xs text-red-900 flex items-start gap-2.5 shadow-md">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm">Crop Mismatch Detected!</strong>
            <p className="mt-1">You selected <strong>{selectedCrop}</strong> but the AI model detected this as <strong>{(result as any)?.cropValidation?.detectedCrop || 'a different crop'}</strong>.
            The uploaded leaf does not match {selectedCrop}. Please select the correct crop type and re-upload the right leaf image.</p>
          </div>
        </div>
      )}
      {(result as any)?.cropValidation?.status === 'no_dl_for_crop' && (
        <div className="rounded-2xl bg-blue-50 border border-blue-300 p-4 text-xs text-blue-900 flex items-start gap-2.5 shadow-xs">
          <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Knowledge Base Result:</strong> The DL model does not have a trained model for {selectedCrop}. 
            This result is based on the agronomic knowledge base only.
          </div>
        </div>
      )}
      {(result as any)?.cropValidation?.status === 'kb_fallback' && (
        <div className="rounded-2xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span><strong>Note:</strong> Result matched via knowledge base fallback. DL model prediction was refined.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Farm Selector & Image Uploader */}
        <div className="lg:col-span-6 space-y-5">
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3">
              Step 1: Select Plot & Specimen Image
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Farm / Plot
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => {
                    setSelectedFarmId(e.target.value);
                    const f = farms.find((farm) => farm.id === e.target.value);
                    if (f) setSelectedCrop(f.crop.name);
                  }}
                  className="input-field"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Crop Specimen Type
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="input-field"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Apple">Apple</option>
                  <option value="Blueberry">Blueberry</option>
                  <option value="Cherry">Cherry</option>
                  <option value="Corn">Corn</option>
                  <option value="Grape">Grape</option>
                  <option value="Orange">Orange</option>
                  <option value="Peach">Peach</option>
                  <option value="Pepper">Pepper</option>
                  <option value="Potato">Potato</option>
                  <option value="Raspberry">Raspberry</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Strawberry">Strawberry</option>
                </select>
              </div>
            </div>

            {/* Image Dropzone / Preview Area */}
            <div className="mt-4">
              {previewImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-agri-600 bg-stone-900 shadow-md">
                  <img
                    src={previewImage}
                    alt="Selected leaf specimen"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold">Specimen loaded ready for neural inference</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                        setResult(null);
                        setApiError(null);
                      }}
                      className="rounded-xl bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold hover:bg-white/30 transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-stone-300 p-8 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-100 text-agri-700 mb-3 shadow-xs">
                    <Camera className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Upload or Capture Leaf Specimen</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Take a clear, well-lit photo of the affected leaf showing visible spots or lesions.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <label className="btn-primary cursor-pointer text-xs py-2 px-4">
                      <Upload className="h-4 w-4" />
                      <span>Browse Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Leaf Upload Note */}
            <div className="pt-3 border-t border-stone-100">
              <div className="rounded-xl bg-blue-50/80 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Upload a Leaf Image Only</strong>
                  <span>Please upload a clear photo of the <strong>affected leaf</strong> (not fruit or stem). Our DL model recognizes leaf diseases for: Tomato, Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Strawberry.</span>
                </div>
              </div>
            </div>

            {/* Analyze Action CTA */}
            <button
              type="button"
              disabled={(!selectedFile && !previewImage) || isAnalyzing}
              onClick={handleStartAnalysis}
              className="btn-primary w-full py-3 text-base font-bold shadow-md disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Executing AI Neural Prediction...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Run AI Disease Analysis</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Output & Treatment Protocol */}
        <div className="lg:col-span-6 space-y-5">
          {isAnalyzing && (
            <div className="card p-8 text-center space-y-5 animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-agri-100 text-agri-700 shadow-md animate-pulse">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Connecting to AI Vision Backend...</h3>
                <p className="text-xs text-slate-500 mt-1">Executing deep neural multi-class pathology model</p>
              </div>

              <div className="space-y-2 text-left max-w-sm mx-auto text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>1. Streaming multipart/form-data payload to /disease/predict</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>2. Processing leaf pathology classification</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>3. Retrieving approved CIB&RC treatment advisory</span>
                </div>
              </div>
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="card p-6 space-y-5 animate-fade-in border-2 border-agri-500/80 shadow-card-hover">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-agri-700 uppercase tracking-wider">
                      Diagnostic Report • #{result.id}
                    </span>
                    {result.isLiveBackendResult && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                        Live Backend Response
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {result.cropName}: {result.diseaseDetected}
                  </h3>
                </div>
                <RiskBadge level={result.riskLevel} size="md" />
              </div>

              {/* Confidence & Severity Summary */}
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Model Confidence</span>
                  <span className="font-mono font-bold text-agri-800 text-sm">{result.confidence}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-agri-500 to-agri-700 transition-all duration-500"
                    style={{ width: `${Math.min(100, result.confidence)}%` }}
                  />
                </div>
                {result.severity && (
                  <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                    <span>Severity Level:</span>
                    <span className="font-bold text-slate-800">{result.severity}</span>
                  </div>
                )}
              </div>

              {/* Warning Signs & Symptoms */}
              {result.symptoms && result.symptoms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Observed Symptoms & Warning Signs
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.symptoms.map((sym, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-agri-600 mt-1.5 shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Advice */}
              {result.advice && (
                <div className="rounded-xl bg-blue-50 p-3.5 border border-blue-200 text-xs text-blue-950">
                  <strong>Agronomic Advice:</strong> {result.advice}
                </div>
              )}

              {/* Chemical Treatment & Active Ingredient */}
              {(result.active_ingredient || result.treatment.chemicalControl.length > 0) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Chemical Treatment & Active Ingredient
                  </h4>
                  <div className="space-y-1.5">
                    {result.active_ingredient && (
                      <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs font-semibold text-amber-950 flex items-start gap-2">
                        <span className="mt-0.5">🧪</span>
                        <div>
                          <p><strong>Active Ingredient:</strong> {result.active_ingredient}</p>
                          {result.application && (
                            <p className="text-amber-800 font-normal mt-0.5"><strong>Application:</strong> {result.application}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {result.treatment.chemicalControl.map((chem, i) => (
                      <div key={i} className="rounded-xl bg-amber-50/60 p-2.5 border border-amber-200/80 text-xs font-medium text-amber-900">
                        {chem}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Note */}
              {result.safety_note && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-900 border border-rose-200 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Safety Precaution:</strong> {result.safety_note}</span>
                </div>
              )}

              {/* PDF Download Button (POST /disease/report) */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isDownloadingPdf}
                  onClick={handleDownloadPdfReport}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-md flex items-center justify-center gap-2"
                >
                  {isDownloadingPdf ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating PDF Report...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4" />
                      <span>Download Official PDF Health Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!isAnalyzing && !result && (
            <div className="card p-10 text-center space-y-3 bg-stone-50/50 border-dashed">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-200/70 text-slate-500">
                <ImageIcon className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Awaiting Specimen Upload</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select a plot and photo on the left to view AI disease diagnostic results from the FastAPI model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
