'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole, NavItem } from '@/types';
import { useAuth } from '@/context';
import { GovBanner } from './GovBanner';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { AlertIcon, ActivityIcon, ChevronRightIcon } from '../ui/Icons';

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
  const { user, isAuthenticated, isLoading, isAuthorizedFor } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Authentication and Authorization check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <GovBanner />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <ActivityIcon className="w-8 h-8 animate-spin text-emerald-700" />
            <p className="text-xs font-semibold tracking-wide">
              Verifying KrishiRakshak National Grid Authorization...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Role crossover prevention: check if user has permission for this portal
  const isAuthorized = isAuthorizedFor(role);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <GovBanner />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="max-w-lg w-full bg-white border-2 border-rose-200 shadow-lg text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-rose-100 text-rose-700 w-fit mb-2">
                <AlertIcon className="w-8 h-8" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-950">
                403 — Unauthorized Portal Access
              </CardTitle>
              <CardDescription className="text-rose-800 font-medium">
                Role Permission Boundary Enforced
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600">
              <p>
                Your account (<strong className="text-slate-900">{user.name}</strong>,{' '}
                <span className="font-semibold text-emerald-800">{user.role}</span>) does not have
                clearance to access the <strong className="text-slate-900">{portalTitle}</strong>.
              </p>
              <div className="p-3 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700 text-left">
                <span>Current Route: </span>
                <span className="text-rose-700 font-bold">{pathname}</span>
                <br />
                <span>Authorized Role: </span>
                <span className="text-emerald-700 font-bold">{role}</span>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/${user.role.toLowerCase()}`)}
                  className="w-full sm:w-auto gap-2 bg-emerald-800 hover:bg-emerald-900"
                >
                  <span>Go to My Authorized Portal ({user.role})</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="w-full sm:w-auto"
                >
                  Switch Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
