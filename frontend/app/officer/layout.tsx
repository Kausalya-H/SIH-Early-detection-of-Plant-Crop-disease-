import React from 'react';
import { Metadata } from 'next';
import { PortalLayout } from '@/components/shared';
import { OFFICER_NAV_ITEMS, PORTAL_CONFIGS } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Officer Command | KrishiRakshak AI Surveillance',
  description: 'Agricultural Officer portal for regional crop disease monitoring and containment.',
};

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  const config = PORTAL_CONFIGS.OFFICER;

  return (
    <PortalLayout
      role="OFFICER"
      portalTitle={config.portalName}
      portalSubtitle={config.portalSubtitle}
      navItems={OFFICER_NAV_ITEMS}
      unreadAlertsCount={3}
    >
      {children}
    </PortalLayout>
  );
}
