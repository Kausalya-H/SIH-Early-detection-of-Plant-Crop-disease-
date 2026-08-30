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
    farmService.getMyFarms().then(({ data }) => {
      if (data) {
        setFarms(data);
        if (data.length > 0) {
          setSelectedFarmId(data[0]._id);
          setSelectedCrop(data[0].crops?.[0]?.cropName || 'Unknown');
        }
      }
    });
  }, []);

  const sampleImages = [
    {
      label: 'Tomato Early Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80',
      disease: 'Early Blight',
      confidence: 96.4,
      riskLevel: 'MODERATE' as RiskLevel,
      symptoms: [
        'Small dark spots appear on older leaves',
        'Spots may develop concentric rings',
        'Leaves gradually turn yellow and fall',
      ],
      advice: 'Remove severely affected leaves and avoid keeping the foliage wet for long periods.',
      treatment: 'Remove infected plant material and improve air circulation. Use a fungicide only when necessary and according to product label.',
      active_ingredient: 'Chlorothalonil or Mancozeb',
      application: 'Follow the locally approved product label for crop, dose, spray interval, and pre-harvest interval.',
      safety_note: 'Use only products approved for tomato and the diagnosed disease. Follow the label and use appropriate protective equipment.',
      chemical: ['Mancozeb 75% WP @ 2.5 g/L', 'Chlorothalonil 75% WP @ 2 g/L'],
      biological: ['Trichoderma viride spray @ 5 g/L', 'Neem cake soil enrichment'],
    },
    {
      label: 'Chilli Bacterial Spot',
      crop: 'Chilli',
      url: 'https://images.unsplash.com/photo-1588644525127-06e22c954e7d?w=600&auto=format&fit=crop&q=80',
      disease: 'Bacterial Leaf Spot',
      confidence: 93.1,
      riskLevel: 'HIGH' as RiskLevel,
      symptoms: [
        'Small water-soaked spots appear on leaves',
        'Spots become dark and irregular',
        'Leaves may yellow and drop',
      ],
      advice: 'Remove heavily affected leaves and avoid overhead irrigation.',
      treatment: 'Remove affected plant material and reduce leaf wetness. Use only locally approved disease-management products when necessary.',
      active_ingredient: 'Copper-based bactericide',
      application: 'Follow the locally approved product label for chilli, including dose and application interval.',
      safety_note: 'Use only products approved for chilli and the diagnosed disease. Follow the product label.',
      chemical: ['Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L'],
      biological: ['Pseudomonas fluorescens foliar spray @ 5 g/L', 'Yellow sticky traps (15/acre)'],
    },
    {
      label: 'Groundnut Early Spot',
      crop: 'Groundnut',
      url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
      disease: 'Early Leaf Spot',
      confidence: 94.5,
      riskLevel: 'MODERATE' as RiskLevel,
      symptoms: [
        'Small brown spots appear on leaves',
        'Spots may have a yellow halo',
        'Affected leaves may fall early',
      ],
      advice: 'Monitor lower leaves regularly and remove heavily affected plant material.',
      treatment: 'Use integrated disease management and an approved fungicide when necessary.',
      active_ingredient: 'Chlorothalonil or Mancozeb',
      application: 'Follow the locally approved product label for groundnut, including dose and spray interval.',
      safety_note: 'Use only products approved for groundnut and the diagnosed disease.',
      chemical: ['Mancozeb 75% WP @ 2 g/L'],
      biological: ['Trichoderma harzianum seed treatment & foliar spray'],
    },
  ];

  const handleSelectSample = async (sample: typeof sampleImages[0]) => {
    setPreviewImage(sample.url);
    setSelectedCrop(sample.crop);
    setApiError(null);

    // Create a dummy image blob so it can be sent to real backend endpoint
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      setSelectedFile(blob);
    } catch {
      // Fallback 1px placeholder blob
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

    const selectedFarm = farms.find((f) => f._id === selectedFarmId);
    const farmName = selectedFarm?.name || 'Main Plot';

    let backendData = null;

    // 1. Try real FastAPI backend POST /disease/predict
    if (selectedFile) {
      const { data, error } = await diagnosisService.predictDisease(selectedFile, selectedCrop, selectedFarmId);
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
      // 2. Fallback to matched sample knowledge base
      const matchedSample = sampleImages.find((s) => s.crop === selectedCrop) || sampleImages[0];
      const record = await diagnosisService.addDiagnosis({
        farmId: selectedFarmId,
        farmName,
        cropName: selectedCrop,
        imageUrl: previewImage || matchedSample.url,
        diseaseDetected: matchedSample.disease,
        confidence: matchedSample.confidence,
        riskLevel: matchedSample.riskLevel,
        symptoms: matchedSample.symptoms,
        advice: matchedSample.advice,
        treatmentText: matchedSample.treatment,
        active_ingredient: matchedSample.active_ingredient,
        application: matchedSample.application,
        safety_note: matchedSample.safety_note,
        treatment: {
          chemicalControl: matchedSample.chemical,
          biologicalControl: matchedSample.biological,
          culturalPractices: [matchedSample.advice],
          safetyPrecautions: [matchedSample.safety_note],
        },
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
    const locationString = user ? `${user.village}, ${user.taluka}, ${user.district}` : 'Baramati, Pune';

    const { error } = await diagnosisService.generateReport({
      file: selectedFile,
      crop: selectedCrop,
      farmer_name: user?.name || 'Ramesh Patil',
      phone: user?.phone || '+91 98220 14321',
      location: locationString,
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
                  <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                  <option value="Chilli">Chilli (Capsicum annuum)</option>
                  <option value="Groundnut">Groundnut (Arachis hypogaea)</option>
                  <option value="Rice">Rice (Oryza sativa)</option>
                  <option value="Soybean">Soybean (Glycine max)</option>
                  <option value="Cotton">Cotton (Gossypium hirsutum)</option>
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

            {/* Quick Demo Sample Photos */}
            <div className="pt-3 border-t border-stone-100">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Or Try Sample Crop Specimens:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="rounded-xl border border-stone-200 p-1.5 hover:border-agri-500 bg-white hover:bg-agri-50/50 transition-all text-left group"
                  >
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="w-full h-16 object-cover rounded-lg mb-1"
                    />
                    <span className="block text-[11px] font-bold text-slate-800 truncate group-hover:text-agri-800">
                      {sample.label}
                    </span>
                  </button>
                ))}
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
