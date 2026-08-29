'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  RiskBadge,
  Button,
} from '@/components/shared';
import {
  BookIcon,
  ScanIcon,
  CheckIcon,
} from '@/components/shared/ui/Icons';

const ADVISORIES = [
  {
    id: 'adv-001',
    title: 'Tomato Early Blight & High Humidity Preventive Protocol',
    crop: 'Tomato',
    riskLevel: 'HIGH' as const,
    publishedAt: '28 Aug 2026',
    issuedBy: 'ICAR-IIHR & DAO Nashik',
    summary:
      'Continuous relative humidity above 85% in northern Maharashtra increases early blight spore discharge rate significantly.',
    actions: [
      'Apply preventative spray of Mancozeb 75 WP @ 2.5 g/liter of water.',
      'Ensure 60cm row spacing to facilitate morning leaf drying and airflow.',
      'Prune lowest 3 branches touching soil to prevent splash inoculation.',
      'Strictly avoid late-afternoon overhead sprinkler watering.',
    ],
    activeIngredient: 'Mancozeb 75 WP or Chlorothalonil 75 WP',
    safetyInterval: 'Pre-harvest interval (PHI): 7 Days',
  },
  {
    id: 'adv-002',
    title: 'Chilli Bacterial Leaf Spot & Sucking Pest Management',
    crop: 'Chilli',
    riskLevel: 'MODERATE' as const,
    publishedAt: '25 Aug 2026',
    issuedBy: 'State Department of Agriculture, Maharashtra',
    summary:
      'Early symptoms of small angular water-soaked lesions observed in isolated chilli nurseries in Niphad block.',
    actions: [
      'Spray Copper Oxychloride 50 WP @ 3 g/L + Streptocycline @ 1 g/10 L of water.',
      'Remove heavily infested leaves and destroy by deep burying.',
      'Install yellow sticky traps (15 traps/acre) for thrips and aphid vectors.',
    ],
    activeIngredient: 'Copper Oxychloride + Streptocycline',
    safetyInterval: 'Pre-harvest interval (PHI): 5 Days',
  },
  {
    id: 'adv-003',
    title: 'Groundnut Early Leaf Spot (Tikka) Seasonal Alert',
    crop: 'Groundnut',
    riskLevel: 'MODERATE' as const,
    publishedAt: '22 Aug 2026',
    issuedBy: 'ICAR-DGR Junagadh Advisory',
    summary:
      'Post-monsoon dry spells followed by intermittent rain favor Cercospora arachidicola development on groundnut leaves.',
    actions: [
      'Foliar application of Carbendazim 12% + Mancozeb 63% WP @ 2 g/L.',
      'Monitor lower leaves twice weekly for dark brown spots with yellow halos.',
      'Maintain balanced potash nutrition to boost natural leaf resistance.',
    ],
    activeIngredient: 'Carbendazim + Mancozeb',
    safetyInterval: 'Pre-harvest interval (PHI): 14 Days',
  },
  {
    id: 'adv-004',
    title: 'Paddy Rice Blast Preventive Nursery Guidelines',
    crop: 'Rice',
    riskLevel: 'LOW' as const,
    publishedAt: '18 Aug 2026',
    issuedBy: 'National Rice Research Institute (NRRI)',
    summary:
      'Standard vegetative stage monitoring for spindle-shaped blast lesions with ash-colored centers.',
    actions: [
      'Seed treatment with Tricyclazole 75 WP @ 2 g/kg of seed.',
      'Avoid excessive split nitrogen application beyond recommended dosage.',
      'Maintain 2–3 cm standing water level during tillering stage.',
    ],
    activeIngredient: 'Tricyclazole 75 WP',
    safetyInterval: 'Pre-harvest interval (PHI): 21 Days',
  },
];

export default function FarmerAdvisoryPage() {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');

  const filteredAdvisories =
    selectedCropFilter === 'ALL'
      ? ADVISORIES
      : ADVISORIES.filter((a) => a.crop.toLowerCase() === selectedCropFilter.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookIcon className="w-6 h-6 text-emerald-300" />
            <h1 className="text-lg font-bold tracking-tight">
              Agro-Meteorological Advisories & Treatment Desk
            </h1>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            Real-time crop protection guidelines issued jointly by ICAR research institutes, state agriculture commissionerates, and district surveillance officers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-700/60 text-xs shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-200">ICAR Advisory Feed: <strong>Synchronized</strong></span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
          Filter by Crop:
        </span>
        {['ALL', 'Tomato', 'Chilli', 'Groundnut', 'Rice'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCropFilter(crop)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCropFilter === crop
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {crop === 'ALL' ? 'All Crops' : crop}
          </button>
        ))}
      </div>

      {/* Advisories Grid */}
      <div className="space-y-4">
        {filteredAdvisories.map((advisory) => (
          <Card key={advisory.id} className="bg-white border-2 border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <CardHeader
              action={
                <div className="flex items-center gap-2">
                  <RiskBadge level={advisory.riskLevel} size="md" />
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {advisory.crop}
                  </span>
                </div>
              }
            >
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-950">
                  {advisory.title}
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs">
                  Issued by: {advisory.issuedBy} • Date: {advisory.publishedAt}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3.5 text-xs">
              <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-200">
                {advisory.summary}
              </p>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  Prescribed Agronomic Action Steps:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {advisory.actions.map((act, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2 text-emerald-950">
                      <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Recommended Active Ingredient:</span>
                  <span className="font-mono text-emerald-800">{advisory.activeIngredient}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Safety & Pre-Harvest Interval:</span>
                  <span className="text-rose-800 font-semibold">{advisory.safetyInterval}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 border-t border-slate-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">Notice spots on your leaves? Run an immediate AI scan.</span>
              <Link href="/farmer/diagnose">
                <Button variant="primary" size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-xs gap-1.5">
                  <ScanIcon className="w-4 h-4" />
                  <span>Scan {advisory.crop} Leaf</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
