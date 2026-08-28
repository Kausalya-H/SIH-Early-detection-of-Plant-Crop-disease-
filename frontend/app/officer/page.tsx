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
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@/components/shared';
import {
  ShieldIcon,
  MapIcon,
  OutbreakIcon,
  AlertIcon,
  FarmIcon,
  CpuIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  ActivityIcon,
} from '@/components/shared/ui/Icons';
import {
  MOCK_OUTBREAKS,
  MOCK_OFFICER_METRICS,
  MOCK_RISK_ZONES,
  MOCK_AI_PREDICTIVE_INSIGHTS,
} from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function OfficerDashboardPage() {
  const topCriticalOutbreak = MOCK_OUTBREAKS.find((o) => o.riskLevel === 'CRITICAL') || MOCK_OUTBREAKS[0];
  const primaryAiInsight = MOCK_AI_PREDICTIVE_INSIGHTS[0];

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Scope Banner */}
      <div className="rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-1.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Officer Command Center
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Surveillance Grid Active
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {MOCK_OFFICER_METRICS.activeJurisdiction} — Real-time epidemiological telemetry, crop damage containment, and emergency advisory broadcast coordination.
            </p>
          </div>

          {/* Sync & Telemetry Metadata */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
              <ActivityIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Last Grid Sync: Today, 01:10 AM IST</span>
            </div>
            <span className="text-[10px] text-amber-300/90 font-medium bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
              Demonstration Environment (Mock Telemetry)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Command Center KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitored Farms"
          value={`${MOCK_OFFICER_METRICS.farmsUnderSurveillance.toLocaleString()}`}
          subtitle={`${MOCK_OFFICER_METRICS.totalMonitoredAcreage.toLocaleString()} Acres Monitored`}
          icon={<FarmIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: `+${MOCK_OFFICER_METRICS.fieldInspectionsThisWeek}`, direction: 'up', label: 'inspections this week' }}
        />

        <StatCard
          title="Active Outbreak Clusters"
          value={MOCK_OFFICER_METRICS.activeOutbreakClusters}
          subtitle="1 Critical • 2 High • 1 Suspected"
          icon={<OutbreakIcon className="w-5 h-5 text-rose-700" />}
          accentColor="rose"
          trend={{ value: `${MOCK_OFFICER_METRICS.containmentRatePercent}%`, direction: 'up', label: 'contained' }}
        />

        <StatCard
          title="Critical Agro-Zones"
          value={MOCK_OFFICER_METRICS.highRiskZonesCount}
          subtitle="Nashik • Ludhiana • Warangal"
          icon={<MapIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
          trend={{ value: '5 Zones', direction: 'neutral', label: 'monitored' }}
        />

        <StatCard
          title="Pending Emergency Alerts"
          value={MOCK_OFFICER_METRICS.criticalAlertsActive}
          subtitle="3,420 Dispatched via SMS / WA"
          icon={<AlertIcon className="w-5 h-5 text-rose-700" />}
          accentColor="rose"
          trend={{ value: '99.1%', direction: 'up', label: 'delivery rate' }}
        />
      </div>

      {/* Top 2-Column Section: Critical Attention Panel & AI Predictive Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Critical Attention Panel */}
        <Card className="border-rose-200 bg-rose-50/20 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader
              action={
                <RiskBadge level={topCriticalOutbreak.riskLevel} size="md" />
              }
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-rose-100 text-rose-800">
                  <OutbreakIcon className="w-4 h-4" />
                </span>
                <CardTitle className="text-rose-950 font-bold">
                  Critical Attention: Immediate Containment Focus
                </CardTitle>
              </div>
              <CardDescription className="text-rose-900/80">
                Highest-severity pathogen cluster requiring field officer intervention.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              <div className="p-3.5 rounded-lg bg-white border border-rose-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 uppercase px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200">
                      {topCriticalOutbreak.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {topCriticalOutbreak.crop} — {topCriticalOutbreak.diseaseName}
                    </h3>
                  </div>
                  <StatusBadge status={topCriticalOutbreak.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500">Location:</span>
                    <p className="font-semibold text-slate-800">
                      {topCriticalOutbreak.location.village}, {topCriticalOutbreak.location.talukOrBlock}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {topCriticalOutbreak.location.district}, {topCriticalOutbreak.location.state}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Scale & Spread:</span>
                    <p className="font-semibold text-slate-800">
                      {topCriticalOutbreak.affectedFarmsCount} Farms Affected
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {topCriticalOutbreak.totalAcreageAffected} Acres within perimeter
                    </p>
                  </div>
                </div>

                {/* Containment progress */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Containment Perimeter Progress:</span>
                    <span className="text-rose-700">{topCriticalOutbreak.containmentProgressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full transition-all duration-300"
                      style={{ width: `${topCriticalOutbreak.containmentProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Directive Advice */}
              <div className="p-3 rounded-md bg-amber-50/80 border border-amber-200/70 space-y-1">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Recommended Officer Directive:
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Dispatch mobile fungicide spraying teams (Mancozeb 2.5g/L) across a 5km quarantine buffer around Pimpalgaon Baswant. Notify 3,420 registered kisan accounts in Niphad block.
                </p>
              </div>
            </CardContent>
          </div>

          <CardFooter className="pt-2">
            <Link href="/officer/outbreaks" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-between text-rose-900 border-rose-200 hover:bg-rose-100/50">
                <span>Open Incident Containment Dossier</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* 6. AI Predictive Insight Card */}
        <Card className="border-indigo-100 bg-indigo-50/20 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader
              action={
                <Badge variant="primary" size="sm">
                  {primaryAiInsight.confidenceScore}% Confidence
                </Badge>
              }
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-indigo-100 text-indigo-800">
                  <CpuIcon className="w-4 h-4" />
                </span>
                <CardTitle className="text-slate-900 font-bold">
                  AI Spore Dispersion Forecast
                </CardTitle>
              </div>
              <CardDescription>
                {primaryAiInsight.modelName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-1">
              <div className="p-3.5 rounded-lg bg-white border border-indigo-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider">
                      Forecast Horizon:
                    </span>
                    <p className="font-semibold text-slate-800">{primaryAiInsight.timeHorizon}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">
                      Infection Probability:
                    </span>
                    <p className="font-bold text-rose-700 text-sm">{primaryAiInsight.riskProbability}% Risk</p>
                  </div>
                </div>

                <div className="text-xs pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Trajectory & Target:</span>
                  <p className="font-semibold text-slate-900">{primaryAiInsight.targetRegion}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{primaryAiInsight.targetCrop} — {primaryAiInsight.pathogen}</p>
                </div>

                <div className="text-xs pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Climatic Trigger:</span>
                  <p className="text-slate-700 text-[11px] italic bg-slate-50 p-2 rounded border border-slate-200">
                    &ldquo;{primaryAiInsight.meteorologicalTrigger}&rdquo;
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {primaryAiInsight.forecastSummary}
                </p>
              </div>

              {/* Recommended Preventative Action */}
              <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 space-y-1">
                <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                  Proactive Mitigation Recommendation:
                </p>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {primaryAiInsight.recommendedAction}
                </p>
              </div>
            </CardContent>
          </div>

          <CardFooter className="pt-2">
            <div className="w-full flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200">
              <span>* Automated ML prediction based on IMD micro-climate radar.</span>
              <span className="font-semibold text-indigo-700">Simulated Model Output</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 3. Regional Risk Overview Section */}
      <Card>
        <CardHeader
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Risk Distribution:
              </span>
              <div className="flex items-center gap-1">
                <RiskBadge level="CRITICAL" size="sm" />
                <RiskBadge level="HIGH" size="sm" />
                <RiskBadge level="MODERATE" size="sm" />
                <RiskBadge level="LOW" size="sm" />
              </div>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-emerald-700" />
            <CardTitle>Regional Agro-Zone Risk Surveillance</CardTitle>
          </div>
          <CardDescription>
            Multi-state disease vulnerability assessments classified by ICAR phytopathological protocols.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_RISK_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{zone.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {zone.district}, {zone.state}
                      </p>
                    </div>
                    <RiskBadge level={zone.riskLevel} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Crops:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {zone.affectedCrops.map((crop) => (
                        <span
                          key={crop}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Monitored Holdings</span>
                    <span className="font-semibold text-slate-800">
                      {zone.monitoredFarmsCount.toLocaleString()} Farms
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Active Outbreaks</span>
                    <span className={`font-semibold ${zone.activeOutbreaksCount > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                      {zone.activeOutbreaksCount} Clusters
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Coordinates synchronized with district agriculture commissionerates.
          </span>
          <Link href="/officer/risk-map" className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>Explore Interactive Risk Map</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </Link>
        </CardFooter>
      </Card>

      {/* 4. Recent Disease / Outbreak Reports Table */}
      <Card>
        <CardHeader
          action={
            <Link href="/officer/outbreaks">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>View All Outbreaks</span>
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </Button>
            </Link>
          }
        >
          <div className="flex items-center gap-2">
            <OutbreakIcon className="w-5 h-5 text-rose-700" />
            <CardTitle>Recent Disease & Outbreak Incident Reports</CardTitle>
          </div>
          <CardDescription>
            Live containment surveillance log indexed from field officer spot-inspections and farmer leaf diagnoses.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outbreak Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Crop & Disease</TableHead>
                <TableHead>Risk Severity</TableHead>
                <TableHead>Affected Area</TableHead>
                <TableHead>Containment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_OUTBREAKS.map((outbreak) => (
                <TableRow key={outbreak.id}>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    {outbreak.code}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">
                      {outbreak.location.district}, {outbreak.location.state}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {outbreak.location.village || outbreak.location.talukOrBlock}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">{outbreak.crop}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={outbreak.diseaseName}>
                      {outbreak.diseaseName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={outbreak.riskLevel} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-slate-800">
                      {outbreak.affectedFarmsCount} Farms
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {outbreak.totalAcreageAffected} Acres
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span>{outbreak.containmentProgressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${outbreak.containmentProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={outbreak.status} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(outbreak.firstDetectedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Showing {MOCK_OUTBREAKS.length} verified surveillance incidents.
          </span>
          <span className="font-mono text-slate-500 text-[11px]">
            Data source: KrishiRakshak Officer Grid
          </span>
        </CardFooter>
      </Card>

      {/* 7. Command Center Quick Actions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-slate-500 text-[11px]">
            Command Center Quick Actions
          </h2>
          <span className="text-[11px] text-slate-400">Direct Portal Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/officer/risk-map" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <MapIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Geospatial Risk Map
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Interactive GIS pathogen heatmaps, weather radar overlays, and spore dispersion vectors.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/officer/outbreaks" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-rose-500 hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-rose-50 text-rose-800 border border-rose-200 group-hover:bg-rose-700 group-hover:text-white transition-colors">
                  <OutbreakIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-rose-700 transition-colors" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                  Review Outbreaks
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Track quarantine boundaries, assign bio-security officers, and monitor containment % rate.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/officer/farms" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-blue-50 text-blue-800 border border-blue-200 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <FarmIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  Monitor Farm Holdings
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Access 10,140 registered farmer land records, soil classifications, and scheduled inspections.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/officer/alerts" className="group">
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 group-hover:bg-amber-700 group-hover:text-white transition-colors">
                  <AlertIcon className="w-5 h-5" />
                </div>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Broadcast Alerts
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Dispatch instant multilingual SMS, WhatsApp, and audio alerts to farming communities.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
