import React from 'react';
import { DiseaseKnowledgeItem } from '../../types/advisory';
import { Modal } from '../common/Modal';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface DiseaseDetailModalProps {
  disease: DiseaseKnowledgeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DiseaseDetailModal: React.FC<DiseaseDetailModalProps> = ({
  disease,
  isOpen,
  onClose,
}) => {
  if (!disease) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${disease.diseaseName} (${disease.crop})`}
      subtitle={disease.scientificName ? `Causal Organism: ${disease.scientificName}` : undefined}
      maxWidth="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Symptoms */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span>Field Symptoms & Warning Signs:</span>
          </h4>
          <ul className="space-y-1">
            {disease.commonSymptoms.map((sym, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Favorable Conditions */}
        <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs sm:text-sm text-slate-700">
          <span className="font-bold text-slate-900 block mb-1">Weather & Favorable Conditions:</span>
          <span>{disease.favorableConditions}</span>
        </div>

        {/* Organic Remedies */}
        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span>Organic & Biological Prevention:</span>
          </h4>
          <ul className="space-y-1">
            {disease.organicRemedies.map((rem, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rem}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chemical Management & Safety */}
        <div className="rounded-2xl bg-stone-100 p-4 border border-stone-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ShieldAlert className="h-4 w-4 text-slate-700" />
            <span>Approved Chemical Management & Safety Guidance</span>
          </div>
          <p className="text-slate-800">{disease.approvedTreatments}</p>
          {disease.activeIngredients && (
            <p className="text-slate-700">
              <strong>Active Ingredient:</strong> {disease.activeIngredients}
            </p>
          )}
          <p className="text-slate-700">
            <strong>Application Note:</strong> {disease.applicationGuidance}
          </p>
          <p className="text-slate-600 italic">
            <strong>Precaution:</strong> {disease.safetyInstructions}
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary text-xs py-2.5 px-5">
            Close Disease Profile
          </button>
        </div>
      </div>
    </Modal>
  );
};
