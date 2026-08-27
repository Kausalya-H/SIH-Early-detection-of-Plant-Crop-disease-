'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { RoleBadge } from '../ui/Badge';
import { AlertIcon, SearchIcon, MenuIcon } from '../ui/Icons';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useTranslation } from '@/i18n';

export interface TopHeaderProps {
  role: UserRole;
  portalTitle: string;
  portalSubtitle?: string;
  onToggleSidebar?: () => void;
  unreadAlertsCount?: number;
}

export function TopHeader({
  role,
  portalTitle,
  portalSubtitle,
  onToggleSidebar,
  unreadAlertsCount = 0,
}: TopHeaderProps) {
  const { t } = useTranslation();

  const roleLabels = {
    OFFICER: t('roles.officer', 'Agriculture Officer'),
    ADMIN: t('roles.admin', 'Central Admin'),
    FARMER: t('roles.farmer', 'Farmer Member'),
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {portalTitle}
              </h1>
              <RoleBadge role={role} />
            </div>
            {portalSubtitle && (
              <p className="text-xs text-slate-500 hidden sm:block">
                {portalSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Quick actions & user status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick search input */}
          <div className="hidden lg:flex items-center relative w-56">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder', 'Search district, crop, disease...')}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400 text-slate-800"
            />
          </div>

          {/* Multilingual UI Language Selector */}
          <LanguageSelector variant="header" />

          {/* Emergency Alert Bell */}
          <Link
            href={role === 'OFFICER' ? '/officer/alerts' : role === 'ADMIN' ? '/admin' : '/farmer'}
            className="relative p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="System Alerts"
          >
            <AlertIcon className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white leading-none">
                {unreadAlertsCount}
              </span>
            )}
          </Link>

          {/* User Session Pill */}
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
              {role === 'OFFICER' ? 'DAO' : role === 'ADMIN' ? 'ADM' : 'KIS'}
            </div>

            <div className="hidden xl:block text-left leading-tight">
              <p className="text-xs font-semibold text-slate-800">
                {roleLabels[role]}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                {t('common.authorizedAccess', 'Authorized Access')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
