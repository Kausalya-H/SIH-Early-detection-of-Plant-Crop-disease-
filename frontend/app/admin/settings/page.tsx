import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@/components/shared';
import { SettingsIcon } from '@/components/shared/ui/Icons';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              System Settings & Global Governance Thresholds
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Configure national epidemic alert sensitivity thresholds, SMS gateway API credentials, automated quarantine trigger rules, and model inference scaling policies.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          System Configuration
        </Badge>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Epidemic Risk Thresholds</CardTitle>
            <CardDescription>Automated severity escalation triggers across agricultural districts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">Critical Alert Spore Dispersal Threshold</p>
                <p className="text-slate-500 text-[11px]">Triggers Level-4 quarantine warnings</p>
              </div>
              <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200">
                &gt; 85% Humidity
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">Outbreak Cluster Radius</p>
                <p className="text-slate-500 text-[11px]">Buffer zone surrounding infected holdings</p>
              </div>
              <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200">
                5.0 km
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">Minimum AI Confidence for Auto-Advisory</p>
                <p className="text-slate-500 text-[11px]">Threshold for instant farmer recommendation</p>
              </div>
              <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200">
                92.0%
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Reset to Defaults</Button>
            <Button variant="primary" size="sm">Save Configuration</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>National Notification Gateways</CardTitle>
            <CardDescription>Status of emergency dispatch integrations across Indian telecom operators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">C-DOT / BSNL Emergency SMS Gateway</p>
                <p className="text-slate-500 text-[11px]">Direct priority telecom routing</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">WhatsApp Business API (Kisan Seva)</p>
                <p className="text-slate-500 text-[11px]">Interactive diagnosis bot channel</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-800">IMD Agro-Meteorological Satellite Feed</p>
                <p className="text-slate-500 text-[11px]">Real-time weather radar ingest</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Streaming
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Test Gateway Ping</Button>
            <Button variant="primary" size="sm">Update API Credentials</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
