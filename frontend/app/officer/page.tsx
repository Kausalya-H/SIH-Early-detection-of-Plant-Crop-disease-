import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  RiskBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
} from '@/components/shared';
import {
  ShieldIcon,
  MapIcon,
  OutbreakIcon,
  AlertIcon,
  AnalyticsIcon,
  FarmIcon,
} from '@/components/shared/ui/Icons';
import { MOCK_OUTBREAKS, MOCK_OFFICER_METRICS, OFFICER_NAV_ITEMS } from '@/lib/mock';

export default function OfficerPortalHome() {
  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold tracking-tight">
              Officer Command & Surveillance Foundation
            </h2>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed max-w-2xl">
            This portal provides regional agriculture officers with geospatial disease outbreak maps, farm inspection trackers, emergency broadcast dispatches, and quarantine containment tools.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-2 rounded border border-emerald-700/50 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-200">Surveillance Grid: <strong>Operational</strong></span>
        </div>
      </div>

      {/* KPI Metric Cards Foundation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Acreage"
          value={`${MOCK_OFFICER_METRICS.totalMonitoredAcreage.toLocaleString()} Acres`}
          subtitle="Across 14 Agro-zones"
          icon={<FarmIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: '+450 ac', direction: 'up', label: 'this week' }}
        />

        <StatCard
          title="Active Outbreak Clusters"
          value={MOCK_OFFICER_METRICS.activeOutbreakClusters}
          subtitle="2 High, 1 Critical, 1 Suspected"
          icon={<OutbreakIcon className="w-5 h-5 text-rose-700" />}
          accentColor="rose"
          trend={{ value: '1 Cluster', direction: 'down', label: 'contained' }}
        />

        <StatCard
          title="Containment Progress"
          value={`${MOCK_OFFICER_METRICS.containmentRatePercent}%`}
          subtitle="Target threshold > 80%"
          icon={<AnalyticsIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
          trend={{ value: '+3.2%', direction: 'up', label: '24h delta' }}
        />

        <StatCard
          title="Emergency Advisories"
          value={MOCK_OFFICER_METRICS.criticalAlertsActive}
          subtitle="Active SMS dispatches"
          icon={<AlertIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />
      </div>

      {/* Planned Officer Navigation Modules Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Outbreak Foundation Table Preview */}
          <Card>
            <CardHeader
              action={
                <span className="text-xs font-semibold text-slate-500">
                  {MOCK_OUTBREAKS.length} Active Records
                </span>
              }
            >
              <CardTitle>Regional Outbreak Surveillance Queue</CardTitle>
              <CardDescription>
                Live containment clusters synchronized with satellite and field report telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outbreak Code</TableHead>
                    <TableHead>Crop & Disease</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Affected Area</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_OUTBREAKS.slice(0, 4).map((outbreak) => (
                    <TableRow key={outbreak.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {outbreak.code}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{outbreak.crop}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">
                          {outbreak.diseaseName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium text-slate-800">
                          {outbreak.location.district}, {outbreak.location.state}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {outbreak.location.village || outbreak.location.talukOrBlock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={outbreak.riskLevel} size="sm" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={outbreak.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {outbreak.totalAcreageAffected} ac
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Officer Architecture Spec Checklist */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Officer Architecture Modules</CardTitle>
              <CardDescription>
                Navigation modules established for subsequent feature implementation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {OFFICER_NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="p-2.5 rounded-md border border-slate-200 bg-slate-50/50 flex items-start gap-3 text-xs"
                >
                  <div className="p-1.5 rounded bg-white border border-slate-200 text-emerald-800 shrink-0">
                    <MapIcon className="w-4 h-4" />
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
        </div>
      </div>
    </div>
  );
}
