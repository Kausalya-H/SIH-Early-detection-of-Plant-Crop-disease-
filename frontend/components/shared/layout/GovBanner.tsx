'use client';

import React from 'react';
import { NationalEmblemMotif } from '../ui/Icons';
import { useTranslation } from '@/i18n';

export function GovBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800">
      {/* Tricolor hairline accent representing Indian Public Sector */}
      <div className="h-[2px] w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NationalEmblemMotif className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="tracking-wide">
            {t('common.govTitle', 'भारत सरकार | Government of India')} — {t('common.govSubtitle', 'Ministry of Agriculture & Farmers Welfare')}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
          <span>{t('common.nationalGrid', 'National AI Surveillance Network')}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('common.gridActive', 'Grid Active')}
          </span>
        </div>
      </div>
    </div>
  );
}
