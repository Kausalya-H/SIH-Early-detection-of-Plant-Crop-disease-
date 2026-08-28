'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/i18n';
import { SupportedLanguage } from '@/i18n/types';
import { GlobeIcon, CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from './Icons';
import { cn } from '@/lib/utils';

export interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'pill';
  className?: string;
  showRegionLabel?: boolean;
}

export function LanguageSelector({
  variant = 'header',
  className,
  showRegionLabel = true,
}: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguageMeta, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter languages based on search query (by English name, native script, region, or code)
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return supportedLanguages;
    const q = searchQuery.toLowerCase().trim();
    return supportedLanguages.filter((lang) => {
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (lang.regionLabel && lang.regionLabel.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, supportedLanguages]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        setSearchQuery('');
      }
      return !prev;
    });
  };

  const triggerClasses = {
    header:
      'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-emerald-700',
    compact:
      'flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer select-none',
    pill:
      'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors cursor-pointer select-none',
  }[variant];

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={handleToggle}
        className={triggerClasses}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`${t('common.language', 'Language')}: ${currentLanguageMeta.nativeName} (${currentLanguageMeta.name})`}
      >
        <GlobeIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="font-semibold text-slate-900">{currentLanguageMeta.nativeName}</span>
        {currentLanguageMeta.code !== 'en' && (
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            ({currentLanguageMeta.name})
          </span>
        )}
        {currentLanguageMeta.direction === 'rtl' && (
          <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800 uppercase">
            RTL
          </span>
        )}
        <ChevronDownIcon
          className={cn('w-3 h-3 text-slate-400 transition-transform duration-150', isOpen ? 'rotate-180' : '')}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={t('common.selectLanguage', 'Select Language')}
          className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-lg bg-white border border-slate-200 shadow-xl z-50 text-slate-800 text-xs focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header with Title & Active Language info */}
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-bold text-xs">{t('common.selectLanguage', 'Select Language')}</p>
                <p className="text-[10px] text-slate-400">22 Eighth Schedule Languages + English</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200">
            <div className="relative flex items-center">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchLanguagePlaceholder', 'Search by language or script...')}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400 text-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Languages Scroll List */}
          <div
            role="listbox"
            className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1"
          >
            {filteredLanguages.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-1">
                <p className="text-xs font-semibold">{t('common.noLanguagesFound', 'No matching language found')}</p>
                <p className="text-[11px] text-slate-400">Try searching &quot;Hindi&quot;, &quot;বাংলা&quot;, or &quot;Urdu&quot;</p>
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-slate-50 transition-colors cursor-pointer select-none',
                      isSelected ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'text-slate-700'
                    )}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 font-sans">
                          {lang.nativeName}
                        </span>
                        <span className="text-[11px] text-slate-500">({lang.name})</span>
                        {lang.direction === 'rtl' && (
                          <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800 uppercase">
                            RTL
                          </span>
                        )}
                      </div>

                      {showRegionLabel && lang.regionLabel && (
                        <span className="text-[10px] text-slate-500 truncate">{lang.regionLabel}</span>
                      )}
                    </div>

                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Constitutional 8th Schedule</span>
            <span className="font-semibold text-emerald-700">23 Languages Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
