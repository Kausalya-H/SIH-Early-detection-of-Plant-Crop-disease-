import { PortalConfig, NavItem } from '@/types';

export const OFFICER_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/officer',
    iconName: 'dashboard',
    description: 'Surveillance summary, KPIs, and regional status',
  },
  {
    title: 'Risk Map',
    href: '/officer/risk-map',
    iconName: 'map',
    description: 'Geospatial disease heatmaps and risk spread',
  },
  {
    title: 'Outbreaks',
    href: '/officer/outbreaks',
    iconName: 'outbreak',
    badge: '3 Active',
    badgeVariant: 'danger',
    description: 'Active epidemic clusters and containment tracking',
  },
  {
    title: 'Farm Monitoring',
    href: '/officer/farms',
    iconName: 'farm',
    description: 'Registered acreage, field inspections, and farmer records',
  },
  {
    title: 'Analytics',
    href: '/officer/analytics',
    iconName: 'analytics',
    description: 'Disease incidence trends and historical patterns',
  },
  {
    title: 'Alerts',
    href: '/officer/alerts',
    iconName: 'alert',
    badge: '5 New',
    badgeVariant: 'warning',
    description: 'Broadcast advisories and emergency SMS dispatches',
  },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    iconName: 'dashboard',
    description: 'System health, portal usage, and critical telemetry',
  },
  {
    title: 'Users',
    href: '/admin/users',
    iconName: 'users',
    description: 'Officers, field workers, and portal access management',
  },
  {
    title: 'Crops & Diseases',
    href: '/admin/crops-diseases',
    iconName: 'disease',
    description: 'Disease taxonomy, treatment protocols, and crop registry',
  },
  {
    title: 'AI Monitoring',
    href: '/admin/ai-monitoring',
    iconName: 'cpu',
    badge: '98.4%',
    badgeVariant: 'success',
    description: 'ML model accuracy, latency, and inference logs',
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    iconName: 'audit',
    description: 'Compliance, security trails, and administrative actions',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    iconName: 'settings',
    description: 'System thresholds, alert channels, and API configs',
  },
];

export const FARMER_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/farmer',
    iconName: 'dashboard',
    description: 'Crop health status, advisory summary, and quick actions',
  },
  {
    title: 'Crop Diagnosis',
    href: '/farmer/diagnose',
    iconName: 'scan',
    description: 'Instant AI leaf scan & disease identification',
  },
  {
    title: 'Report Disease',
    href: '/farmer/report',
    iconName: 'report',
    description: 'Report field symptoms to regional agriculture officers',
  },
  {
    title: 'Advisories',
    href: '/farmer/advisory',
    iconName: 'book',
    description: 'Seasonal weather advisories and treatment guides',
  },
  {
    title: 'My Profile',
    href: '/farmer/profile',
    iconName: 'user',
    description: 'Registered crops, acreage, and farm details',
  },
];

export const PORTAL_CONFIGS: Record<'FARMER' | 'OFFICER' | 'ADMIN', PortalConfig> = {
  FARMER: {
    portalId: 'FARMER',
    portalName: 'Kisan Portal',
    portalSubtitle: 'Farmer Crop Diagnosis & Advisory Desk',
    basePath: '/farmer',
    accentColor: 'emerald',
    navItems: FARMER_NAV_ITEMS,
  },
  OFFICER: {
    portalId: 'OFFICER',
    portalName: 'Officer Command',
    portalSubtitle: 'Regional Agricultural Surveillance & Outbreak Response',
    basePath: '/officer',
    accentColor: 'emerald',
    navItems: OFFICER_NAV_ITEMS,
  },
  ADMIN: {
    portalId: 'ADMIN',
    portalName: 'Admin Central',
    portalSubtitle: 'System Administration, AI Oversight & Governance',
    basePath: '/admin',
    accentColor: 'slate',
    navItems: ADMIN_NAV_ITEMS,
  },
};
