import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FarmerHeader } from './FarmerHeader';
import { FarmerSidebar } from './FarmerSidebar';
import { MobileNavigation } from './MobileNavigation';
import { Modal } from '../common/Modal';
import { Send, CheckCircle2, Phone, MessageSquare, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FarmerLayout: React.FC = () => {
  const { user } = useAuth();
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issueType, setIssueType] = useState('DISEASE');
  const [urgency, setUrgency] = useState('URGENT');
  const [description, setDescription] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `OAR-MH-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedId);
    setIsSubmitted(true);
  };

  const handleResetModal = () => {
    setIsSubmitted(false);
    setDescription('');
    setIsOfficerModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900">
      {/* Official Top Header */}
      <FarmerHeader
        unreadAlertsCount={3}
      />

      <div className="flex flex-1">
        {/* Desktop Navigation Sidebar */}
        <FarmerSidebar onRequestOfficerSupport={() => setIsOfficerModalOpen(true)} />

        {/* Main Routed Content Area */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNavigation />

      {/* Officer Support Modal */}
      <Modal
        isOpen={isOfficerModalOpen}
        onClose={handleResetModal}
        title="Request KVK Agricultural Officer Support"
        subtitle="Connect directly with your block extension officer and plant pathologist"
      >
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Assistance Request Registered!</h3>
            <p className="mt-1 text-sm text-slate-600">
              Your agricultural issue has been forwarded to the Baramati KVK extension desk. An officer will review your farm data and call you.
            </p>
            <div className="mt-4 inline-block rounded-xl bg-stone-100 px-4 py-2 text-sm font-mono font-bold text-slate-800 border border-stone-200">
              Reference ID: {referenceId}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleResetModal}
                className="btn-primary w-full"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="rounded-xl bg-stone-100 p-3 text-xs text-slate-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-agri-600 shrink-0" />
              <span>Location: <strong>{user?.village}, {user?.taluka}, {user?.district}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Problem Category *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="input-field"
              >
                <option value="DISEASE">Fungal / Bacterial Blight Outbreak</option>
                <option value="PEST">Severe Sucking Pest / Thrips Infestation</option>
                <option value="WEATHER">Excess Rain / Moisture Damage</option>
                <option value="SOIL">Nutrient Deficiency & Wilting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Urgency Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="input-field"
              >
                <option value="URGENT">Urgent (Within 24 Hours)</option>
                <option value="ROUTINE">Routine (2-3 Days Advisory)</option>
                <option value="EMERGENCY">Emergency (Rapid Crop Loss Threat)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Field Observation & Notes *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible leaf spots, percentage of plot affected, or symptoms..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleResetModal}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Send className="h-4 w-4" />
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
