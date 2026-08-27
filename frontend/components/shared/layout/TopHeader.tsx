'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { RoleBadge, RiskBadge } from '../ui/Badge';
import { AlertIcon, SearchIcon, MenuIcon, XIcon, OutbreakIcon, MapIcon, FarmIcon, ChevronRightIcon } from '../ui/Icons';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useTranslation } from '@/i18n';
import { MOCK_OUTBREAKS, MOCK_RISK_ZONES, MOCK_MONITORED_FARMS } from '@/lib/mock';

export interface TopHeaderProps {
  role: UserRole;
  portalTitle: string;
  portalSubtitle?: string;
  onToggleSidebar?: () => void;
  unreadAlertsCount?: number;
}

interface SearchResultItem {
  id: string;
  type: 'outbreak' | 'risk_zone' | 'farm';
  title: string;
  subtitle: string;
  category: string;
  href: string;
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export function TopHeader({
  role,
  portalTitle,
  portalSubtitle,
  onToggleSidebar,
  unreadAlertsCount = 0,
}: TopHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const roleLabels = {
    OFFICER: t('roles.officer', 'Agriculture Officer'),
    ADMIN: t('roles.admin', 'Central Admin'),
    FARMER: t('roles.farmer', 'Farmer Member'),
  };

  // Compute matched results across Outbreaks, Risk Zones, and Monitored Farms
  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // 1. Search Outbreaks (Code, Disease, Crop, District, State, Village)
    for (const o of MOCK_OUTBREAKS) {
      if (
        o.code.toLowerCase().includes(q) ||
        o.crop.toLowerCase().includes(q) ||
        o.diseaseName.toLowerCase().includes(q) ||
        o.location.district.toLowerCase().includes(q) ||
        o.location.state.toLowerCase().includes(q) ||
        (o.location.village && o.location.village.toLowerCase().includes(q)) ||
        (o.location.talukOrBlock && o.location.talukOrBlock.toLowerCase().includes(q))
      ) {
        results.push({
          id: `outbreak-${o.id}`,
          type: 'outbreak',
          title: `${o.crop} — ${o.diseaseName}`,
          subtitle: `${o.code} • ${o.location.district}, ${o.location.state} (${o.affectedFarmsCount} farms affected)`,
          category: 'Outbreak Record',
          href: '/officer/outbreaks',
          riskLevel: o.riskLevel,
        });
      }
    }

    // 2. Search Risk Zones & Clusters (Name, District, State, Crops)
    for (const r of MOCK_RISK_ZONES) {
      if (
        r.name.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.affectedCrops.some((c) => c.toLowerCase().includes(q))
      ) {
        results.push({
          id: `risk-${r.id}`,
          type: 'risk_zone',
          title: r.name,
          subtitle: `${r.district}, ${r.state} • ${r.affectedCrops.join(', ')}`,
          category: 'Agro-Risk Zone',
          href: '/officer/risk-map',
          riskLevel: r.riskLevel,
        });
      }
    }

    // 3. Search Monitored Farms (Farm Name, Farmer, Crop, District, State)
    for (const f of MOCK_MONITORED_FARMS) {
      if (
        (f.farmName && f.farmName.toLowerCase().includes(q)) ||
        f.farmerName.toLowerCase().includes(q) ||
        f.primaryCrop.toLowerCase().includes(q) ||
        f.location.district.toLowerCase().includes(q) ||
        f.location.state.toLowerCase().includes(q) ||
        (f.location.village && f.location.village.toLowerCase().includes(q))
      ) {
        results.push({
          id: `farm-${f.id}`,
          type: 'farm',
          title: f.farmName || f.farmerName,
          subtitle: `Farmer: ${f.farmerName} • ${f.primaryCrop} (${f.acreage} ac) • ${f.location.district}, ${f.location.state}`,
          category: 'Monitored Farm',
          href: '/officer/farms',
          riskLevel: f.currentRiskLevel,
        });
      }
    }

    return results.slice(0, 8); // Top 8 matching results
  }, [searchQuery]);

  // Click outside and Escape handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectResult = (href: string) => {
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  const getResultIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'outbreak':
        return <OutbreakIcon className="w-4 h-4 text-rose-700 shrink-0" />;
      case 'risk_zone':
        return <MapIcon className="w-4 h-4 text-emerald-700 shrink-0" />;
      case 'farm':
        return <FarmIcon className="w-4 h-4 text-blue-700 shrink-0" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
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

        {/* Right: Quick actions, global search & user session */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Desktop Global Search Bar */}
          <div ref={searchContainerRef} className="hidden lg:block relative w-72">
            <div className="relative flex items-center">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setIsDropdownOpen(true);
                  }
                }}
                placeholder={t('common.searchPlaceholder', 'Search district, crop, disease...')}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400 text-slate-800 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search query"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden text-xs max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Search Matches ({searchResults.length})</span>
                  <span className="font-mono text-slate-400 text-[9px]">&ldquo;{searchQuery}&rdquo;</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">No matching records found</p>
                    <p className="text-[11px] text-slate-400">
                      Try searching &ldquo;Nashik&rdquo;, &ldquo;Tomato&rdquo;, &ldquo;Wheat&rdquo;, or &ldquo;OB-2026&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 p-1">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectResult(item.href)}
                        className="w-full text-left p-2.5 rounded-md hover:bg-slate-50 flex items-start justify-between gap-2.5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="p-1.5 rounded bg-slate-100 mt-0.5">
                            {getResultIcon(item.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs truncate">
                                {item.title}
                              </span>
                              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.riskLevel && <RiskBadge level={item.riskLevel} size="sm" />}
                          <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Press Esc to close</span>
                  <span className="font-medium text-emerald-700">KrishiRakshak Officer Search</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Trigger Icon */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Open mobile search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Multilingual UI Language Selector */}
          <LanguageSelector variant="header" />

          {/* Emergency Alert Bell */}
          <Link
            href={role === 'OFFICER' ? '/officer/alerts' : role === 'ADMIN' ? '/admin/audit-logs' : '/farmer'}
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

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden mt-2.5 pt-2.5 border-t border-slate-200">
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder', 'Search district, crop, disease...')}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-900"
            />
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Search Results */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-slate-500">
                  No matching records found.
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectResult(item.href)}
                    className="w-full text-left p-2.5 hover:bg-slate-50 flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded bg-slate-100 mt-0.5">
                        {getResultIcon(item.type)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                    {item.riskLevel && <RiskBadge level={item.riskLevel} size="sm" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
