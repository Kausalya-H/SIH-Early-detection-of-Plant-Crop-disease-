'use client';

import React, { useState } from 'react';
import { UserRole, NavItem } from '@/types';
import { GovBanner } from './GovBanner';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export interface PortalLayoutProps {
  role: UserRole;
  portalTitle: string;
  portalSubtitle?: string;
  navItems: NavItem[];
  unreadAlertsCount?: number;
  children: React.ReactNode;
}

export function PortalLayout({
  role,
  portalTitle,
  portalSubtitle,
  navItems,
  unreadAlertsCount = 0,
  children,
}: PortalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Topmost Official Indian Government Banner */}
      <GovBanner />

      <div className="flex flex-1 relative">
        {/* Responsive Navigation Sidebar */}
        <Sidebar
          items={navItems}
          portalRole={role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader
            role={role}
            portalTitle={portalTitle}
            portalSubtitle={portalSubtitle}
            unreadAlertsCount={unreadAlertsCount}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          {/* Official Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                © 2026 KrishiRakshak AI — Ministry of Agriculture & Farmers Welfare, Govt. of India.
              </p>
              <p className="text-[11px] text-slate-400">
                Early Plant Disease Detection & Outbreak Surveillance Grid
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
