import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FarmerHeader } from './FarmerHeader';
import { FarmerSidebar } from './FarmerSidebar';
import { MobileNavigation } from './MobileNavigation';
import { RequestOfficerModal } from '../common/RequestOfficerModal';

export const FarmerLayout: React.FC = () => {
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-900">
      {/* Header */}
      <FarmerHeader unreadAlertsCount={2} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <FarmerSidebar onRequestOfficerSupport={() => setIsOfficerModalOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          <Outlet context={{ openOfficerModal: () => setIsOfficerModalOpen(true) }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Officer Assistance Modal */}
      <RequestOfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
      />
    </div>
  );
};
