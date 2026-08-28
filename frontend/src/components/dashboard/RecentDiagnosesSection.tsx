import React, { useState } from 'react';
import { DiagnosisRecord } from '../../types/disease';
import { RiskBadge } from '../common/RiskBadge';
import { Modal } from '../common/Modal';
import { Link } from 'react-router-dom';
import { Microscope, ChevronRight, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RecentDiagnosesSectionProps {
  diagnoses: DiagnosisRecord[];
}

export const RecentDiagnosesSection: React.FC<RecentDiagnosesSectionProps> = ({ diagnoses }) => {
  const { t } = useLanguage();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisRecord | null>(null);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Microscope className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentDiagnosesTitle}</h2>
            <p className="text-xs text-slate-500">Computer vision model outputs with management protocols</p>
          </div>
        </div>

        <Link
          to="/farmer/disease-detection"
          className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-800"
        >
          <span>Run New Scan</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diagnoses.slice(0, 4).map((record) => (
          <div
            key={record.id}
            className="rounded-2xl border border-stone-200 p-4 bg-white hover:border-stone-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500">{record.cropName} • {record.farmName}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{record.diseaseDetected}</h3>
                  {record.scientificName && (
                    <p className="text-[11px] text-slate-400 italic">{record.scientificName}</p>
                  )}
                </div>

                <RiskBadge level={record.riskLevel} size="sm" />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-slate-700">
                  {record.confidence}% Confidence
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{record.diagnosedAt}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                record.status === 'ACTION_TAKEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Status: {record.status}
              </span>

              <button
                type="button"
                onClick={() => setSelectedDiagnosis(record)}
                className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-900 cursor-pointer"
              >
                <span>View Treatment Plan</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnosis Treatment Details Modal */}
      {selectedDiagnosis && (
        <Modal
          isOpen={!!selectedDiagnosis}
          onClose={() => setSelectedDiagnosis(null)}
          title={`Diagnosis: ${selectedDiagnosis.diseaseDetected}`}
          subtitle={`${selectedDiagnosis.cropName} on ${selectedDiagnosis.farmName} (${selectedDiagnosis.diagnosedAt})`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-stone-100">
              <div>
                <span className="text-xs text-slate-500 block">AI Neural Vision Confidence</span>
                <span className="text-base font-bold text-slate-900">{selectedDiagnosis.confidence}% Match</span>
              </div>
              <RiskBadge level={selectedDiagnosis.riskLevel} size="md" />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Identified Symptoms
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedDiagnosis.symptoms.map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-agri-600 mt-1.5 shrink-0" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedDiagnosis.treatment.chemicalControl.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Chemical Treatment Dosage (Approved CIB&RC)
                </h4>
                <div className="space-y-1.5">
                  {selectedDiagnosis.treatment.chemicalControl.map((chem, i) => (
                    <div key={i} className="rounded-xl bg-amber-50/80 p-2.5 border border-amber-200/80 text-xs text-amber-900">
                      🧪 {chem}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Biological & Cultural Management
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedDiagnosis.treatment.culturalPractices.map((prac, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{prac}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedDiagnosis.officerNotes && (
              <div className="rounded-2xl bg-blue-50 p-3.5 border border-blue-200 text-xs text-blue-950">
                <strong>Officer Extension Note:</strong> {selectedDiagnosis.officerNotes}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedDiagnosis(null)}
                className="btn-primary"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
