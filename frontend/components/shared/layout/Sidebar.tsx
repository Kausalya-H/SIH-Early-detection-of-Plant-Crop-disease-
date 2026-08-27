'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem, UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { getIconByName, ShieldIcon, XIcon, ChevronRightIcon } from '../ui/Icons';
import { Badge } from '../ui/Badge';
import { useTranslation } from '@/i18n';

export interface SidebarProps {
  items: NavItem[];
  portalRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ items, portalRole, isOpen = false, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const portalMetadata = {
    OFFICER: {
      title: t('portals.officer.title', 'Officer Command'),
      code: 'KR-SURVEILLANCE',
      accentBg: 'bg-emerald-900',
    },
    ADMIN: {
      title: t('portals.admin.title', 'Admin Central'),
      code: 'KR-GOVERNANCE',
      accentBg: 'bg-slate-900',
    },
    FARMER: {
      title: t('portals.farmer.title', 'Kisan Portal'),
      code: 'KR-FARMER-DESK',
      accentBg: 'bg-emerald-800',
    },
  }[portalRole];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Top: Portal Branding */}
        <div>
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:bg-emerald-500 transition-colors">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-white tracking-tight">KrishiRakshak</span>
                  <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-emerald-800 text-emerald-300">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">कृषि रक्षक • {t('common.nationalGrid', 'National Grid')}</p>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
                aria-label="Close Sidebar"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Portal Context Tag */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">{portalMetadata.title}</span>
            <span className="text-[10px] font-mono text-slate-500">{portalMetadata.code}</span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {items.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${portalRole.toLowerCase()}` && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all select-none',
                    isActive
                      ? 'bg-emerald-800/80 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    >
                      {getIconByName(item.iconName, { className: 'w-4 h-4' })}
                    </span>
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'default'}
                      size="sm"
                      className="ml-auto text-[10px] py-0 px-1.5 font-bold tracking-tight uppercase"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Portal Switcher & System Meta */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2">
            {t('common.switchPortal', 'Switch Portal Gateway')}
          </p>

          <div className="grid grid-cols-3 gap-1">
            <Link
              href="/farmer"
              className={cn(
                'px-2 py-1.5 rounded text-center text-[11px] font-medium transition-colors',
                portalRole === 'FARMER'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              {t('roles.farmer', 'Farmer')}
            </Link>

            <Link
              href="/officer"
              className={cn(
                'px-2 py-1.5 rounded text-center text-[11px] font-medium transition-colors',
                portalRole === 'OFFICER'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              {t('roles.officer', 'Officer')}
            </Link>

            <Link
              href="/admin"
              className={cn(
                'px-2 py-1.5 rounded text-center text-[11px] font-medium transition-colors',
                portalRole === 'ADMIN'
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              {t('roles.admin', 'Admin')}
            </Link>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <span>{t('common.returnHome', 'Return to National Home')}</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
