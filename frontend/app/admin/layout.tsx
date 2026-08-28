import React from 'react';
import { Metadata } from 'next';
import { PortalLayout } from '@/components/shared';
import { ADMIN_NAV_ITEMS, PORTAL_CONFIGS } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Admin Central | KrishiRakshak AI Governance',
  description: 'National Agricultural AI administration, model registry, user permissions, and audit logs.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const config = PORTAL_CONFIGS.ADMIN;

  return (
    <PortalLayout
      role="ADMIN"
      portalTitle={config.portalName}
      portalSubtitle={config.portalSubtitle}
      navItems={ADMIN_NAV_ITEMS}
    >
      {children}
    </PortalLayout>
  );
}
