import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  RiskBadge,
  Badge,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/shared';
import { OutbreakIcon } from '@/components/shared/ui/Icons';
import { MOCK_OUTBREAKS } from '@/lib/mock';

export default function OfficerOutbreaksPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-rose-950 text-white border border-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <OutbreakIcon className="w-5 h-5 text-rose-300" />
            <h2 className="text-base font-bold tracking-tight">
              Active Disease Outbreak Clusters & Quarantine Tracking
            </h2>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed max-w-2xl">
            Live epidemic clusters, containment perimeter progression, bio-security measures, and field quarantine officer assignments.
          </p>
        </div>

        <Badge variant="danger" size="sm">
          {MOCK_OUTBREAKS.length} Active Outbreaks
        </Badge>
      </div>

      {/* Outbreaks Master Table */}
      <Card>
        <CardHeader
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-700">
                Sorted by Severity
              </span>
            </div>
          }
        >
          <CardTitle>Regional Containment Queue</CardTitle>
          <CardDescription>
            Active disease incidents requiring surveillance verification or emergency quarantine.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Crop & Disease</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Affected Farms / Area</TableHead>
                <TableHead>Containment</TableHead>
                <TableHead>Officer in Charge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_OUTBREAKS.map((outbreak) => (
                <TableRow key={outbreak.id}>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    {outbreak.code}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">{outbreak.crop}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
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
                    <div className="text-xs font-medium text-slate-800">
                      {outbreak.officerInCharge?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {outbreak.officerInCharge?.phone || ''}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
