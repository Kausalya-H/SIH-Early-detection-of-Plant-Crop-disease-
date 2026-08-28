import { UserRole } from './auth';

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'danger' | 'warning' | 'success';
  description?: string;
  isExternal?: boolean;
}

export interface PortalConfig {
  portalId: UserRole;
  portalName: string;
  portalSubtitle: string;
  basePath: string;
  accentColor: string;
  navItems: NavItem[];
}
