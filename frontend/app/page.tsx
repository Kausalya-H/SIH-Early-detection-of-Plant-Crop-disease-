'use client';

import React from 'react';
import Link from 'next/link';
import {
  GovBanner,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  RiskBadge,
  Badge,
  LanguageSelector,
} from '@/components/shared';
import {
  ShieldIcon,
  ChevronRightIcon,
  FarmIcon,
  MapIcon,
  CpuIcon,
  NationalEmblemMotif,
  ActivityIcon,
} from '@/components/shared/ui/Icons';
import { useTranslation } from '@/i18n';

export default function Home() {
  const { t } = useTranslation();

  const portals = [
    {
      id: 'farmer',
      title: t('portals.farmer.title', 'Kisan / Farmer Portal'),
      hindiTitle: t('portals.farmer.subtitle', 'किसान सेवा पोर्टल'),
      role: 'FARMER' as const,
      href: '/farmer',
      description: t(
        'portals.farmer.tagline',
        'Instant AI-powered leaf disease diagnosis, local agro-meteorological advisories, and direct field symptom reporting.'
      ),
      icon: <FarmIcon className="w-6 h-6 text-emerald-700" />,
      features: [
        t('farmer.aiLeafDiagnosis', 'AI Leaf Photo Diagnosis'),
        t('farmer.outbreakReporting', 'Direct Officer Outbreak Reporting'),
        t('farmer.regionalAdvisories', 'Multilingual Advisory Feeds'),
      ],
      badge: 'Teammate Workspace',
      badgeVariant: 'neutral' as const,
      accentBorder: 'hover:border-emerald-600',
      btnBg: 'bg-emerald-800 hover:bg-emerald-900',
      btnText: t('portals.farmer.enterBtn', 'Enter Kisan Portal'),
    },
    {
      id: 'officer',
      title: t('portals.officer.title', 'Officer Command & Surveillance'),
      hindiTitle: t('portals.officer.subtitle', 'कृषि अधिकारी निगरानी कक्ष'),
      role: 'OFFICER' as const,
      href: '/officer',
      description: t(
        'portals.officer.tagline',
        'Geospatial epidemic risk maps, containment cluster management, farm inspection logs, and emergency SMS advisory broadcast.'
      ),
      icon: <MapIcon className="w-6 h-6 text-blue-700" />,
      features: [
        t('nav.riskMap', 'Geospatial Risk Spread Maps'),
        t('officer.outbreakQueue', 'Active Outbreak Containment Queue'),
        t('officer.emergencyAdvisories', 'Emergency Broadcast Dispatches'),
      ],
      badge: 'Assigned Responsibility',
      badgeVariant: 'primary' as const,
      accentBorder: 'hover:border-blue-600',
      btnBg: 'bg-emerald-700 hover:bg-emerald-800',
      btnText: t('portals.officer.enterBtn', 'Enter Officer Portal'),
    },
    {
      id: 'admin',
      title: t('portals.admin.title', 'Admin Central & AI Governance'),
      hindiTitle: t('portals.admin.subtitle', 'केंद्रीय प्रशासन एवं एआई नियंत्रण'),
      role: 'ADMIN' as const,
      href: '/admin',
      description: t(
        'portals.admin.tagline',
        'Vision Transformer inference telemetry, model drift tracking, RBAC user provisioning, and cryptographically verified audit trails.'
      ),
      icon: <CpuIcon className="w-6 h-6 text-purple-700" />,
      features: [
        t('admin.modelFleet', 'AI Vision Model Telemetry (98.4% Acc)'),
        t('nav.users', 'Role-Based User Management'),
        t('admin.auditTrail', 'Compliance & Security Audit Stream'),
      ],
      badge: 'Assigned Responsibility',
      badgeVariant: 'primary' as const,
      accentBorder: 'hover:border-purple-600',
      btnBg: 'bg-slate-900 hover:bg-slate-800',
      btnText: t('portals.admin.enterBtn', 'Enter Admin Portal'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Official Government of India Top Banner */}
      <GovBanner />

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold text-xs tracking-wider uppercase border border-emerald-300">
                  Smart India Hackathon 2026
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                  {t('common.nationalGrid', 'National Agriculture AI Grid')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
                <span>{t('common.appName', 'KrishiRakshak AI')}</span>
                <span className="text-emerald-700 text-2xl sm:text-3xl font-bold font-serif">
                  कृषि रक्षक
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                National early crop disease detection, epidemic spread forecasting, and coordinated outbreak containment platform built for Indian farmers and agricultural authorities.
              </p>
            </div>

            {/* National Emblem & Grid Status & Language Selector */}
            <div className="shrink-0 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <NationalEmblemMotif className="w-10 h-10 text-slate-700 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-900">Ministry of Agriculture</p>
                  <p className="text-slate-500">Government of India</p>
                  <div className="flex items-center gap-1.5 pt-0.5 text-emerald-700 font-semibold text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>6 Languages Active</span>
                  </div>
                </div>
              </div>

              <div className="sm:border-l sm:border-slate-200 sm:pl-3 pt-2 sm:pt-0 border-t border-slate-200">
                <LanguageSelector variant="header" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Portal Entry Selector */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('common.switchPortal', 'Select Operational Portal Gateway')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Three specialized portals operating on a single unified multilingual architecture.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portals.map((portal) => (
              <Card
                key={portal.id}
                className={`bg-white border-2 border-slate-200 transition-all flex flex-col justify-between ${portal.accentBorder} shadow-xs hover:shadow-md`}
              >
                <div>
                  <CardHeader
                    action={
                      <Badge variant={portal.badgeVariant} size="sm">
                        {portal.badge}
                      </Badge>
                    }
                  >
                    <div className="p-2.5 rounded-lg bg-slate-100 w-fit mb-3">
                      {portal.icon}
                    </div>
                    <CardTitle className="text-lg font-bold">{portal.title}</CardTitle>
                    <CardDescription className="text-emerald-800 font-medium">
                      {portal.hindiTitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {portal.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Key Capabilities:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {portal.features.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={portal.href}
                    className={`w-full py-2.5 px-4 rounded-md text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${portal.btnBg}`}
                  >
                    <span>{portal.btnText}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Shared Architecture Standards Showcase */}
        <section className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Standardized National Risk Scale & Visual Language
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Strict 4-level public-sector risk classification across all portals and advisory feeds.
              </p>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              ISO 9001:AgriSpec
            </span>
          </div>

          {/* Risk Badges Demo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
              <RiskBadge level="LOW" size="md" />
              <p className="text-xs font-semibold text-emerald-950">{t('riskLevels.low', 'Normal Field Condition')}</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {t('riskLevels.lowDesc', 'Baseline crop health. Standard cultural practices & periodic scouting.')}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
              <RiskBadge level="MODERATE" size="md" />
              <p className="text-xs font-semibold text-amber-950">{t('riskLevels.moderate', 'Early Symptom Cluster')}</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {t('riskLevels.moderateDesc', 'Isolated lesions detected. Preventive bio-fungicide sprays advised.')}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-orange-200 bg-orange-50/50 space-y-2">
              <RiskBadge level="HIGH" size="md" />
              <p className="text-xs font-semibold text-orange-950">{t('riskLevels.high', 'Active Spread Warning')}</p>
              <p className="text-[11px] text-orange-900 leading-relaxed">
                {t('riskLevels.highDesc', 'Multi-farm cluster affected. District agriculture officers alerted for containment.')}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
              <RiskBadge level="CRITICAL" size="md" />
              <p className="text-xs font-semibold text-rose-950">{t('riskLevels.critical', 'Emergency Epidemic Outbreak')}</p>
              <p className="text-[11px] text-rose-900 leading-relaxed">
                {t('riskLevels.criticalDesc', 'Severe spore dispersal rate. Quarantine perimeter and emergency broadcast active.')}
              </p>
            </div>
          </div>

          {/* Foundation Layer Architecture Summary */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldIcon className="w-4 h-4 text-emerald-700" />
                <span>Strict Domain Typing</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All models in <code className="text-slate-800 font-mono">@/types</code> define shared contracts for Outbreaks, Farms, Risk, Diseases, and Users.
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ActivityIcon className="w-4 h-4 text-blue-700" />
                <span>Isolated API Client Layer</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Backend routes in <code className="text-slate-800 font-mono">@/lib/api</code> cleanly interface with FastAPI endpoints without leaking into UI pages.
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CpuIcon className="w-4 h-4 text-purple-700" />
                <span>Multilingual & Mock Layer</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Centralized dictionaries in <code className="text-slate-800 font-mono">@/i18n</code> support English, हिन्दी, తెలుగు, ಕನ್ನಡ, தமிழ், and മലയാളം.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Official Public Sector Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-slate-200 font-semibold">
              {t('common.appName', 'KrishiRakshak AI')} — {t('common.appSubtitle', 'National Agriculture Disease Early Warning Grid')}
            </p>
            <p className="text-[11px] text-slate-400">
              {t('common.allRightsReserved', 'Department of Agriculture & Farmers Welfare, Ministry of Agriculture, New Delhi 110001')}
            </p>
          </div>
          <div className="text-center md:text-right text-[11px] text-slate-400">
            <p>Smart India Hackathon 2026 Initiative</p>
            <p className="text-slate-400">Designed for Scalable Public-Sector Crop Protection</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
