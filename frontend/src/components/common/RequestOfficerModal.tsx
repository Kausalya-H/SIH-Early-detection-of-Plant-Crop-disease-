import React, { useState } from 'react';
import { Modal } from './Modal';
import { officerService } from '../../services/officerService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle2 } from 'lucide-react';

interface RequestOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId?: string;
  farmName?: string;
  cropName?: string;
  scanId?: string;
}

export const RequestOfficerModal: React.FC<RequestOfficerModalProps> = ({
  isOpen,
  onClose,
  farmId = 'farm_01',
  farmName = 'Baramati North Plot',
  cropName = 'Tomato',
  scanId,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [issueType, setIssueType] = useState<'DISEASE' | 'PEST' | 'SOIL_FERTILITY' | 'OTHER'>('DISEASE');
  const [urgency, setUrgency] = useState<'ROUTINE' | 'URGENT' | 'EMERGENCY'>('URGENT');
  const [contactMode, setContactMode] = useState<'PHONE_CALL' | 'FIELD_VISIT' | 'WHATSAPP'>('PHONE_CALL');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await officerService.submitRequest({
        farmerId: user?.id || 'farmer_mh_01',
        farmerName: user?.name || 'Farmer',
        phone: user?.phone || '+91 98220 14321',
        farmId,
        farmName,
        cropName,
        scanId,
        issueType,
        urgency,
        preferredContactMode: contactMode,
        description,
      });
      setSubmittedId(res.requestId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={t.officerModal.title}
      subtitle={`${t.officerModal.subtitle} — (${cropName} / ${farmName})`}
      maxWidth="lg"
    >
      {submittedId ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Request Registered</h3>
          <p className="mt-1 text-sm text-slate-600">
            {t.officerModal.successMessage}
          </p>
          <div className="mt-4 inline-block rounded-xl bg-stone-100 px-4 py-2 text-sm font-mono font-semibold text-slate-800">
            Ref ID: {submittedId}
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="btn-primary w-full"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.officerModal.issueType}
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as any)}
              className="input-field"
            >
              <option value="DISEASE">Crop Disease / Fungal Blight</option>
              <option value="PEST">Pest Infestation / Sucking Insects</option>
              <option value="SOIL_FERTILITY">Nutrient Deficiency & Soil Issue</option>
              <option value="OTHER">Other Agronomic Consultation</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.officerModal.urgency}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="input-field"
              >
                <option value="ROUTINE">Routine (3-4 days)</option>
                <option value="URGENT">Urgent (24-48 hours)</option>
                <option value="EMERGENCY">Emergency Crop Loss (Immediate)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.officerModal.contactMethod}
              </label>
              <select
                value={contactMode}
                onChange={(e) => setContactMode(e.target.value as any)}
                className="input-field"
              >
                <option value="PHONE_CALL">Phone Call</option>
                <option value="WHATSAPP">WhatsApp Video / Advisory</option>
                <option value="FIELD_VISIT">On-Site Field Visit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.officerModal.description}
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.officerModal.descriptionPlaceholder}
              className="input-field resize-none"
            />
          </div>

          <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            Note: Your farm location ({farmName}) and recent AI scan diagnostics will be automatically attached for the agricultural officer's review.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm"
              disabled={isSubmitting}
            >
              {t.officerModal.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : t.officerModal.submit}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
