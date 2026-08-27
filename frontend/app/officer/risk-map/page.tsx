import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  RiskBadge,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/shared';
import { MapIcon } from '@/components/shared/ui/Icons';
import { MOCK_RISK_ZONES } from '@/lib/mock';

export default function OfficerRiskMapPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold tracking-tight">
              Geospatial Epidemic Risk Map & Zone Surveillance
            </h2>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
            Real-time geospatial heatmaps indicating spore dispersal probability, weather vulnerability factors, and active disease clusters across agricultural blocks.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          5 Monitored Clusters
        </Badge>
      </div>

      {/* Map Canvas Placeholder & Zone List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[380px] flex flex-col">
            <CardHeader
              action={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Layer:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                    Satellite Spore Dispersion
                  </span>
                </div>
              }
            >
              <CardTitle>Interactive Geospatial Heatmap</CardTitle>
              <CardDescription>
                GIS layer mapping pathogen incidence against agro-climatic satellite telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-b-lg border-t border-slate-100 text-center">
              <div className="p-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3 shadow-xs">
                <MapIcon className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
                GIS Mapping Engine Ready
              </h4>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-4">
                Full Leaflet/MapLibre vector tile integration will bind to regional GPS coordinates during the dashboard implementation phase.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-mono">20.011° N, 73.790° E (Nashik)</span>
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-mono">30.901° N, 75.857° E (Ludhiana)</span>
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-mono">10.787° N, 79.137° E (Thanjavur)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitored Agro-Clusters List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Agro-Clusters</CardTitle>
              <CardDescription>
                Live risk classification by district.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cluster</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Farms</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RISK_ZONES.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>
                        <div className="font-semibold text-slate-900 text-xs">{zone.name}</div>
                        <div className="text-[11px] text-slate-500">{zone.district}, {zone.state}</div>
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={zone.riskLevel} size="sm" />
                      </TableCell>
                      <TableCell className="text-right font-medium text-xs">
                        {zone.monitoredFarmsCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
