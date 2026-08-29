'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  RiskBadge,
  Badge,
  Button,
} from '@/components/shared';
import {
  ScanIcon,
  ReportIcon,
  BookIcon,
  ShieldIcon,
  FarmIcon,
  ChevronRightIcon,
  AlertIcon,
  ArrowUpRightIcon,
  UserIcon,
} from '@/components/shared/ui/Icons';
import { useAuth } from '@/context';

const RECENT_DIAGNOSES = [
  {
    id: 'diag-001',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    confidence: 94,
    severity: 'MODERATE' as const,
    scannedAt: 'Today, 09:30 AM',
    treatment: 'Mancozeb 2.5g/L foliar spray advised',
  },
  {
    id: 'diag-002',
    crop: 'Chilli',
    disease: 'Healthy Leaf Pattern',
    confidence: 98,
    severity: 'LOW' as const,
    scannedAt: 'Yesterday, 04:15 PM',
    treatment: 'No fungicide required. Standard irrigation.',
  },
  {
    id: 'diag-003',
    crop: 'Rice / Paddy',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    confidence: 91,
    severity: 'HIGH' as const,
    scannedAt: '26 Aug 2026',
    treatment: 'Tricyclazole 75 WP at 0.6g/L applied',
  },
];

export default function FarmerPortalHome() {
  const { user } = useAuth();

  const farmerName = user?.name || 'Rameshwar Rao';
  const district = user?.jurisdiction?.district || 'Nashik';
  const state = user?.jurisdiction?.state || 'Maharashtra';

  return (
    <div className="space-y-6">
      {/* Top Welcome & Surveillance Notice Banner */}
      <div className="p-5 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-6 h-6 text-emerald-300" />
            <h1 className="text-xl font-bold tracking-tight">
              नमस्ते, {farmerName} | Kisan Portal Desk
            </h1>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            Welcome to the National Agriculture Disease Early Warning Grid ({district}, {state}). Instant leaf disease AI diagnosis, local weather advisories, and direct officer support are active.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-700/60 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-200">District DAO Link: <strong>Active</strong></span>
          </div>
          <Link href="/farmer/diagnose">
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <ScanIcon className="w-4 h-4" />
              <span>Instant Leaf Scan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Crop Holdings"
          value="5.5 Acres"
          subtitle="Tomato (3.5 ac) • Chilli (2.0 ac)"
          icon={<FarmIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
        />

        <StatCard
          title="AI Leaf Scans Completed"
          value="18 Scans"
          subtitle="3 Recent • 94.2% Avg Confidence"
          icon={<ScanIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
        />

        <StatCard
          title="Regional Outbreak Status"
          value="1 Alert in Block"
          subtitle="Niphad Taluk • Early Blight Warning"
          icon={<AlertIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />

        <StatCard
          title="Active Advisories"
          value="4 New"
          subtitle="High humidity fungicide alert"
          icon={<BookIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
        />
      </div>

      {/* Quick Action Navigation Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
            Kisan Core Operational Modules
          </h2>
          <span className="text-[11px] text-slate-400">Direct Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Diagnose */}
          <Link href="/farmer/diagnose" className="group">
            <div className="p-4 rounded-lg bg-white border-2 border-emerald-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <ScanIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    AI Leaf Scan & Diagnosis
                  </h3>
                  <Badge variant="success" size="sm">Primary</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Upload leaf photo for instant disease prediction, severity score, and treatment protocols.
                </p>
              </div>
            </div>
          </Link>

          {/* 2. Report Outbreak */}
          <Link href="/farmer/report" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-rose-500 hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-rose-50 text-rose-800 group-hover:bg-rose-700 group-hover:text-white transition-colors">
                  <ReportIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-rose-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                  Report Disease Outbreak
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Send symptoms directly to District Agriculture Officers (DAO) and download official PDF health dossier.
                </p>
              </div>
            </div>
          </Link>

          {/* 3. Advisories */}
          <Link href="/farmer/advisory" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-blue-50 text-blue-800 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <BookIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  Advisories & Weather Tips
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Seasonal agro-meteorological advisories, spray intervals, and preventive bio-fungicide advice.
                </p>
              </div>
            </div>
          </Link>

          {/* 4. Profile & Farms */}
          <Link href="/farmer/profile" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-purple-50 text-purple-800 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-purple-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
                  My Profile & Farm Details
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Manage registered farmer details, soil classifications, acreage, and national registry status.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 2-Column: Recent Scans & Weather Advisory Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Diagnoses Table */}
        <div className="lg:col-span-8">
          <Card className="bg-white border border-slate-200 shadow-xs">
            <CardHeader
              action={
                <Link href="/farmer/diagnose">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <span>New Scan</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              }
            >
              <div className="flex items-center gap-2">
                <ScanIcon className="w-5 h-5 text-emerald-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Recent Leaf Diagnosis Log
                </CardTitle>
              </div>
              <CardDescription>
                AI inference history stored for your registered farm plots.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {RECENT_DIAGNOSES.map((item) => (
                  <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{item.crop}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-600 font-medium truncate">{item.disease}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium">{item.treatment}</p>
                      <span className="text-[10px] text-slate-400">{item.scannedAt}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <RiskBadge level={item.severity} size="sm" />
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {item.confidence}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between p-3">
              <span>All inferences calibrated with ICAR Phytopathology standard protocols.</span>
              <Link href="/farmer/diagnose" className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px]">
                Run Live Prediction →
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Urgent Weather & Advisory Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-amber-50/60 border border-amber-200 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertIcon className="w-5 h-5 text-amber-700" />
                <CardTitle className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  District Agro-Weather Alert
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-amber-900">
              <div className="p-3 rounded bg-white border border-amber-200 space-y-1">
                <p className="font-bold text-slate-900">High Relative Humidity (88%)</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Continuous drizzle in Nashik & Niphad creates prime conditions for early blight spore germination in tomato crops.
                </p>
              </div>

              <div className="space-y-1 text-[11px]">
                <p className="font-bold text-amber-950 uppercase">Immediate Kisan Action:</p>
                <p className="leading-relaxed text-amber-900">
                  Ensure adequate field drainage. Avoid overhead sprinkler irrigation during late evenings. Inspect lower tomato foliage daily.
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/farmer/advisory" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-amber-900 border-amber-300 hover:bg-amber-100/50 text-xs">
                  View Full Advisory Calendar
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Kisan Call Center Support Banner */}
          <div className="p-3.5 rounded-lg bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>📞 Kisan Toll-Free Advisory Support</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Call <strong className="text-white">1800-180-1551</strong> for free agronomist voice assistance in Hindi, Marathi, Telugu, Tamil, and Kannada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
