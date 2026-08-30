import React, { useState, useEffect } from 'react';
import { nlpService } from '../../services/nlpService';
import { NLPQueryResponse, NLPSampleQuery } from '../../types/nlp';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sprout,
  ShieldCheck,
  Info,
  Layers,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface NLPQueryAssistantProps {
  initialCrop?: string;
}

export const NLPQueryAssistant: React.FC<NLPQueryAssistantProps> = ({
  initialCrop = 'Tomato',
}) => {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NLPQueryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sampleQueries, setSampleQueries] = useState<NLPSampleQuery[]>([]);
  const [copied, setCopied] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ online: boolean; status: string }>({
    online: false,
    status: 'checking',
  });
  const [queryHistory, setQueryHistory] = useState<NLPQueryResponse[]>([]);

  useEffect(() => {
    nlpService.getSampleQueries().then(setSampleQueries);
    nlpService.checkNLPHealth().then(setBackendStatus);
  }, []);

  const handleQuerySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) {
      setErrorMsg('Please enter a crop disease symptom description or agricultural question.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    const res = await nlpService.askCropDoctor(queryText, selectedCrop, language);

    setIsLoading(false);

    if (res.data) {
      setResult(res.data);
      setQueryHistory((prev) => [res.data!, ...prev.slice(0, 4)]);
      if (res.error) {
        setErrorMsg(res.error);
      }
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleSelectSample = (sample: NLPSampleQuery) => {
    setQueryText(sample.query);
    setSelectedCrop(sample.crop);
    setErrorMsg(null);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const textToCopy = `[KrishiRakshak AI Diagnosis]
Crop: ${result.crop}
Disease: ${result.matched_disease} (Confidence: ${result.confidence}%)
Severity: ${result.severity}
Summary: ${result.summary}
Treatment: ${result.treatment}
Active Ingredient: ${result.active_ingredient}
Application: ${result.application}
Safety Note: ${result.safety_note}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cropPills = ['All Crops', 'Tomato', 'Chilli', 'Groundnut', 'Rice', 'Cotton', 'Soybean'];

  return (
    <div className="space-y-6">
      {/* 1. Header & Engine Status Card */}
      <div className="card p-6 bg-gradient-to-br from-agri-900 via-agri-800 to-agri-950 text-white shadow-xl rounded-3xl border border-agri-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-agri-600/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-agri-100 backdrop-blur-md border border-agri-400/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>FastAPI NLP Knowledge Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              AI Agricultural Doctor & Symptom Assistant
            </h2>
            <p className="text-xs sm:text-sm text-agri-100 leading-relaxed max-w-2xl">
              Ask any crop question in natural language (English, Hindi, Marathi, or regional terminology) to get instant pathology diagnosis, CIB&RC-approved chemical dosages, biological controls, and safety protocols.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold backdrop-blur-md border shrink-0 ${
              backendStatus.online
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                : 'bg-stone-700/40 text-stone-300 border-stone-500/30'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'
              }`}
            />
            <span>NLP Backend: {backendStatus.online ? 'Online' : 'Standby Mode'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Query Box & Crop Filter */}
      <div className="card p-6 space-y-4 bg-white border border-stone-200 shadow-sm rounded-3xl">
        {/* Crop Selection Filter Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Target Crop Specimen (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {cropPills.map((c) => {
              const val = c === 'All Crops' ? 'ALL' : c;
              const isSelected = selectedCrop === val || (selectedCrop === 'ALL' && c === 'All Crops');
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCrop(val)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-agri-700 text-white shadow-xs'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Natural Language Query Input Form */}
        <form onSubmit={handleQuerySubmit} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Describe Crop Symptoms or Ask a Question *
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={queryText}
              onChange={(e) => {
                setQueryText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g. My tomato leaves have dark brown spots with concentric circles, and lower leaves are falling. What chemical or organic spray should I use?"
              className="input-field py-3 pr-12 text-sm leading-relaxed rounded-2xl resize-none"
            />
            {queryText && (
              <button
                type="button"
                onClick={() => setQueryText('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-2xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400">
              Supports symptom descriptions, chemical active ingredient lookups, and organic remedies.
            </span>

            <button
              type="submit"
              disabled={isLoading || !queryText.trim()}
              className="btn-primary w-full sm:w-auto py-2.5 px-6 text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing NLP Query...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Ask AI Crop Doctor</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 3. Quick 1-Click Sample Questions */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Try Sample Agricultural Questions:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sampleQueries.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-agri-50/70 hover:border-agri-400 transition-all text-xs group flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 group-hover:text-agri-800 flex items-center justify-between">
                  <span>{sample.topic}</span>
                  <span className="text-[10px] bg-stone-200 px-1.5 py-0.2 rounded text-slate-700">
                    {sample.crop}
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{sample.query}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Loading Skeleton & Progress */}
      {isLoading && (
        <div className="card p-8 bg-white border-2 border-agri-500/50 shadow-md text-center space-y-4 animate-fade-in rounded-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-100 text-agri-700 shadow-xs animate-pulse">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Analyzing Agricultural Symptom Query...
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracting pathogen markers & matching approved CIB&RC treatment protocols
            </p>
          </div>
        </div>
      )}

      {/* 5. Rich NLP Diagnostic Output Card */}
      {!isLoading && result && (
        <div className="card p-6 sm:p-8 bg-white border-2 border-agri-600 shadow-xl rounded-3xl space-y-6 animate-fade-in">
          {/* Header & Match Confidence */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-agri-700 uppercase tracking-wider">
                  AI NLP Diagnostic Output
                </span>
                {result.isFallback ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                    Knowledge Base Mode
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>FastAPI NLP Verified</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {result.crop}: {result.matched_disease}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <RiskBadge level={result.severity} size="md" />
              <button
                type="button"
                onClick={handleCopySummary}
                className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-slate-600 hover:bg-stone-100 transition-colors shadow-2xs"
                title="Copy diagnosis summary"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Model Confidence & Intent Banner */}
          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Semantic Matching Confidence</span>
              <span className="font-mono font-bold text-agri-800 text-sm">{result.confidence}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-agri-500 to-agri-700 transition-all duration-500"
                style={{ width: `${Math.min(100, result.confidence)}%` }}
              />
            </div>
            <p className="text-xs text-slate-700 pt-1 leading-relaxed">{result.summary}</p>
          </div>

          {/* Warning Signs & Symptoms */}
          {result.warning_signs && result.warning_signs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Primary Symptoms & Warning Signs</span>
              </h4>
              <div className="rounded-2xl bg-amber-50/40 p-4 border border-amber-200/70">
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {result.warning_signs.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Chemical Control & Active Ingredient */}
          {(result.active_ingredient || result.treatment) && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-agri-700" />
                <span>CIB&RC-Approved Chemical Control & Active Ingredients</span>
              </h4>
              <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-200 text-xs space-y-2 text-slate-800">
                {result.active_ingredient && (
                  <p>
                    <strong className="text-blue-950 font-bold">Active Ingredient:</strong>{' '}
                    <span className="font-semibold text-blue-900">{result.active_ingredient}</span>
                  </p>
                )}
                {result.application && (
                  <p>
                    <strong className="text-blue-950 font-bold">Application Guidance:</strong>{' '}
                    <span>{result.application}</span>
                  </p>
                )}
                {result.treatment && (
                  <p className="pt-1 text-slate-700">
                    <strong className="text-slate-900 font-bold">Treatment Protocol:</strong>{' '}
                    {result.treatment}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Organic & Biological Control */}
          {result.organic_remedies && result.organic_remedies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sprout className="h-4 w-4 text-emerald-700" />
                <span>Biological & Organic Control Remedies</span>
              </h4>
              <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-200 text-xs">
                <ul className="space-y-1.5 text-emerald-950">
                  {result.organic_remedies.map((org, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{org}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Preventive Farming Tips */}
          {result.preventive_tips && result.preventive_tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-600" />
                <span>Preventative Agricultural Cultural Practices</span>
              </h4>
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs">
                <ul className="space-y-1.5 text-slate-700">
                  {result.preventive_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-agri-600 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Safety Precaution Alert */}
          {result.safety_note && (
            <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-bold">Safety Note:</strong> {result.safety_note}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 6. Recent Session Query History */}
      {queryHistory.length > 0 && (
        <div className="card p-6 bg-white border border-stone-200 shadow-xs rounded-3xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-500" />
              <span>Recent Queries from this Session ({queryHistory.length})</span>
            </h4>
            <button
              type="button"
              onClick={() => setQueryHistory([])}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-2">
            {queryHistory.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setResult(item);
                  setQueryText(item.query);
                  setSelectedCrop(item.crop);
                }}
                className="p-3 rounded-xl border border-stone-200 hover:border-agri-400 hover:bg-stone-50 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">&ldquo;{item.query}&rdquo;</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.crop} • {item.matched_disease} ({item.confidence}% Match)
                  </p>
                </div>
                <RiskBadge level={item.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
