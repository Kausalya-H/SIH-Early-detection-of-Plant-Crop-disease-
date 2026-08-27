import React from 'react';
import { Metadata } from 'next';
import { PortalLayout } from '@/components/shared';
import { FARMER_NAV_ITEMS, PORTAL_CONFIGS } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Kisan Portal | KrishiRakshak AI',
  description: 'Farmer portal for plant disease diagnosis, local advisories, and crop health reporting.',
};

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const config = PORTAL_CONFIGS.FARMER;

  return (
    <PortalLayout
      role="FARMER"
      portalTitle={config.portalName}
      portalSubtitle={config.portalSubtitle}
      navItems={FARMER_NAV_ITEMS}
    >
      {children}
    </PortalLayout>
  );
}
