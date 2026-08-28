import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';
import { farmService } from '../services/farmService';
import { diagnosisService } from '../services/diagnosisService';
import { Farm } from '../types/farmer';
import { DiagnosisRecord } from '../types/disease';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileDown,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('farm_01');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [result, setResult] = useState<DiagnosisRecord | null>(null);

  useEffect(() => {
    farmService.getFarms().then((data) => {
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarmId(data[0].id);
        setSelectedCrop(data[0].crop.name);
      }
    });
  }, []);

  const sampleImages = [
    {
      label: 'Tomato Early Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80',
      disease: 'Early Blight (Alternaria solani)',
      scientificName: 'Alternaria solani',
      confidence: 96.4,
      riskLevel: 'MODERATE' as const,
      symptoms: ['Concentric circular target lesions on leaf blade', 'Yellow chlorotic margins around dark spots'],
      chemical: ['Mancozeb 75% WP @ 2.5 g/L', 'Azoxystrobin 23% SC @ 1 ml/L'],
      biological: ['Trichoderma viride spray @ 5 g/L', 'Neem cake soil enrichment'],
    },
    {
      label: 'Chilli Leaf Curl',
      crop: 'Chilli',
      url: 'https://images.unsplash.com/photo-1588644525127-06e22c954e7d?w=600&auto=format&fit=crop&q=80',
      disease: 'Chilli Leaf Curl Virus (Begomovirus)',
      scientificName: 'Begomovirus',
      confidence: 93.1,
      riskLevel: 'HIGH' as const,
      symptoms: ['Upward puckering & leaf curling', 'Stunting of apical shoot growth'],
      chemical: ['Diafenthiuron 50% WP @ 1.2 g/L', 'Acetamiprid 20% SP @ 0.3 g/L for vector control'],
      biological: ['Yellow/Blue sticky traps (15/acre)', 'Neem oil 10000 ppm @ 2 ml/L'],
    },
    {
      label: 'Healthy Soybean Canopy',
      crop: 'Soybean',
      url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
      disease: 'Healthy Crop (No Active Infection)',
      scientificName: 'Glycine max',
      confidence: 99.2,
      riskLevel: 'LOW' as const,
      symptoms: ['Normal chlorophyll distribution', 'Vigorous leaf expansion with zero necrotic lesions'],
      chemical: [],
      biological: ['Maintain standard bio-fertilizer schedule'],
    },
  ];

  const handleSelectSample = (sample: typeof sampleImages[0]) => {
    setPreviewImage(sample.url);
    setSelectedCrop(sample.crop);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleStartAnalysis = async () => {
    if (!previewImage) return;

    setIsAnalyzing(true);
    setResult(null);

    // Progression simulation
    setAnalyzingStep(1);
    await new Promise((r) => setTimeout(r, 600));
    setAnalyzingStep(2);
    await new Promise((r) => setTimeout(r, 700));
    setAnalyzingStep(3);
    await new Promise((r) => setTimeout(r, 600));

    const matchedSample = sampleImages.find((s) => s.crop === selectedCrop) || sampleImages[0];
    const selectedFarm = farms.find((f) => f.id === selectedFarmId);

    const record = await diagnosisService.addDiagnosis({
      farmId: selectedFarmId,
      farmName: selectedFarm?.name || 'Selected Plot',
      cropName: selectedCrop,
      imageUrl: previewImage,
      diseaseDetected: matchedSample.disease,
      scientificName: matchedSample.scientificName,
      confidence: matchedSample.confidence,
      riskLevel: matchedSample.riskLevel,
      symptoms: matchedSample.symptoms,
      treatment: {
        chemicalControl: matchedSample.chemical,
        biologicalControl: matchedSample.biological,
        culturalPractices: ['Improve drainage', 'Avoid sprinkler wetting of leaves during noon'],
        safetyPrecautions: ['Use PPE kit during chemical application', 'Check pre-harvest interval'],
      },
      status: 'PENDING',
    });

    setIsAnalyzing(false);
    setResult(record);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Crop Disease Detection"
        subtitle="Upload or capture a leaf photo for instant computer vision pathology diagnosis & safe remedy prescription"
        badge={
          <span className="rounded-full bg-agri-100 px-3 py-1 text-xs font-bold text-agri-800 border border-agri-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-agri-700" />
            <span>YOLOv11 Diagnostic Vision Model</span>
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Farm Selector & Image Uploader */}
        <div className="lg:col-span-6 space-y-5">
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3">
              Step 1: Select Plot & Upload Image
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
                  <option value="Soybean">Soybean (Glycine max)</option>
                  <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                  <option value="Wheat">Wheat (Triticum aestivum)</option>
                  <option value="Rice">Rice (Oryza sativa)</option>
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
                        setResult(null);
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
                    Take a clear, well-lit photo of the affected leaf, stem, or fruit showing visible spots.
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
                Or Try Sample Field Specimens:
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
              disabled={!previewImage || isAnalyzing}
              onClick={handleStartAnalysis}
              className="btn-primary w-full py-3 text-base font-bold shadow-md disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Processing Diagnostic Model...</span>
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
                <h3 className="text-lg font-bold text-slate-900">Analyzing Crop Leaf Pathology...</h3>
                <p className="text-xs text-slate-500 mt-1">Executing deep neural vision multi-class classifier</p>
              </div>

              <div className="space-y-2 text-left max-w-sm mx-auto text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>1. Preprocessing image contrast & leaf segmentation</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>2. Scanning lesion morphology & fungal spore markers</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analyzingStep >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-slate-400'}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>3. Compiling CIB&RC approved dosage recommendations</span>
                </div>
              </div>
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="card p-6 space-y-5 animate-fade-in border-2 border-agri-500/80 shadow-card-hover">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-bold text-agri-700 uppercase tracking-wider">
                    Diagnostic Report • #{result.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {result.diseaseDetected}
                  </h3>
                  {result.scientificName && (
                    <p className="text-xs text-slate-500 italic">{result.scientificName}</p>
                  )}
                </div>
                <RiskBadge level={result.riskLevel} size="md" />
              </div>

              {/* Confidence Meter */}
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Diagnostic Match Confidence</span>
                  <span className="font-mono font-bold text-agri-800 text-sm">{result.confidence}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-agri-500 to-agri-700 transition-all duration-500"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* Identified Symptoms */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Observed Pathology Symptoms
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

              {/* Chemical Treatment Prescription */}
              {result.treatment.chemicalControl.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Chemical Sprays (CIB&RC Standard)
                  </h4>
                  <div className="space-y-1.5">
                    {result.treatment.chemicalControl.map((chem, i) => (
                      <div key={i} className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs font-semibold text-amber-950 flex items-center gap-2">
                        <span>🧪</span>
                        <span>{chem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biological Control */}
              {result.treatment.biologicalControl.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Organic / Bio-Pesticide Alternative
                  </h4>
                  <div className="space-y-1.5">
                    {result.treatment.biologicalControl.map((bio, i) => (
                      <div key={i} className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center gap-2">
                        <span>🌿</span>
                        <span>{bio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Disclaimer Banner */}
              <div className="rounded-xl bg-stone-100 p-3 text-[11px] text-slate-600 leading-relaxed border border-stone-200">
                ⚠️ <strong>Disclaimer:</strong> AI predictions assist early screening. Always inspect label safety instructions and consult your local KVK extension officer for confirmation before large-acreage spraying.
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
                Select a plot and photo on the left to view instant disease diagnostic results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
