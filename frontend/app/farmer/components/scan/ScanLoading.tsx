import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Scan, CheckCircle2 } from 'lucide-react';

export const ScanLoading: React.FC = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    t.scan.analyzingStep1,
    t.scan.analyzingStep2,
    t.scan.analyzingStep3,
    t.scan.analyzingStep4,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="card border-agri-300 bg-gradient-to-b from-white to-agri-50/40 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
      {/* Animated AI processing beacon */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-agri-400 opacity-20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-agri-500 opacity-30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-agri-700 text-white shadow-lg shadow-agri-700/40">
          <Scan className="h-8 w-8 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span>{t.scan.analyzingTitle}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          AI neural network is evaluating leaf tissue patterns
        </p>
      </div>

      {/* Step by step indicators */}
      <div className="space-y-3 text-left max-w-md mx-auto pt-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-xl p-3 text-xs sm:text-sm transition-all ${
                isCurrent
                  ? 'bg-agri-100 text-agri-950 font-bold border border-agri-300'
                  : isDone
                  ? 'bg-white text-slate-600 border border-stone-200'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-agri-600 shrink-0" />
              ) : isCurrent ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-agri-700 border-t-transparent shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-stone-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
