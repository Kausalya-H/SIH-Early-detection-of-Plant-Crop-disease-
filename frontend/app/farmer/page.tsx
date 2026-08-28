import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Badge,
} from '@/components/shared';
import {
  ScanIcon,
  ReportIcon,
  BookIcon,
  ShieldIcon,
  FarmIcon,
} from '@/components/shared/ui/Icons';
import { FARMER_NAV_ITEMS } from '@/lib/mock';

export default function FarmerPortalHome() {
  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-lg bg-emerald-800 text-white border border-emerald-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold tracking-tight">
              किसान पोर्टल आधारशिला | Kisan Portal Foundation
            </h2>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            This workspace is configured for the Farmer Portal teammate. The backend API bindings for AI leaf prediction, outbreak reporting, and farmer registration are isolated and available in <code className="bg-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">@/lib/api</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-2 rounded border border-emerald-600/50 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-emerald-100">Farmer APIs: <strong>Ready to Bind</strong></span>
        </div>
      </div>

      {/* Farmer Feature Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Leaf Diagnosis AI"
          value="54 Diseases"
          subtitle="Instant image analysis"
          icon={<ScanIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
        />

        <StatCard
          title="Regional Advisories"
          value="12 Active"
          subtitle="Seasonal weather & spray tips"
          icon={<BookIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
        />

        <StatCard
          title="Field Outbreak Reports"
          value="Direct DAO Link"
          subtitle="One-click officer escalation"
          icon={<ReportIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />
      </div>

      {/* Architecture Guidance for Teammate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Farmer Portal Navigation Architecture</CardTitle>
            <CardDescription>
              Pre-configured route modules available for implementation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {FARMER_NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="p-3 rounded-md border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded bg-white border border-slate-200 text-emerald-800 shrink-0">
                  <FarmIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <code className="text-[10px] text-slate-500 font-mono">{item.href}</code>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            action={
              <Badge variant="primary" size="sm">
                Backend Integrated
              </Badge>
            }
          >
            <CardTitle>Ready Backend API Endpoints</CardTitle>
            <CardDescription>
              Standardized, typed API functions ready to import from <code className="text-slate-700 font-mono">@/lib/api</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">predictDisease(params)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                  POST /disease/predict
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Accepts leaf image <code className="text-slate-700">file</code> and <code className="text-slate-700">crop</code> name. Returns AI disease diagnosis with confidence score.
              </p>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">reportDisease(params)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                  POST /disease/report
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Multipart form sending crop photo, farmer name, phone number, and field location to officer surveillance.
              </p>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">createFarmer(payload) / getFarmers()</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-bold">
                  POST / GET /farmers/
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Registers farmer profiles (name, phone, language, location, crop) and retrieves the national registry.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
