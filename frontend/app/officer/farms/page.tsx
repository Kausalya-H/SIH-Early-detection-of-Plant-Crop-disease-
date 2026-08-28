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
import { FarmIcon } from '@/components/shared/ui/Icons';
import { MOCK_MONITORED_FARMS } from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function OfficerFarmsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FarmIcon className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold tracking-tight">
              Farm Monitoring, Field Inspections & Land Registry
            </h2>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
            Agricultural land records, soil type classifications, registered farmer contact directories, and field inspection scheduling.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          {MOCK_MONITORED_FARMS.length} Monitored Holdings
        </Badge>
      </div>

      {/* Farms Master Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              National Farmer Database Integrated
            </span>
          }
        >
          <CardTitle>Registered Farm Holdings</CardTitle>
          <CardDescription>
            Monitored agricultural holdings under active disease surveillance.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Name</TableHead>
                <TableHead>Farmer Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Acreage</TableHead>
                <TableHead>Primary Crop</TableHead>
                <TableHead>Current Risk</TableHead>
                <TableHead>Last Inspection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MONITORED_FARMS.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">
                      {farm.farmName || 'Kisan Agricultural Land'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{farm.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 text-xs">{farm.farmerName}</div>
                    <div className="text-[11px] text-slate-500">{farm.farmerPhone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-800 font-medium">
                      {farm.location.village}, {farm.location.district}
                    </div>
                    <div className="text-[11px] text-slate-500">{farm.location.state}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-slate-800">
                    {farm.acreage} Acres
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-800 text-xs">
                      {farm.primaryCrop}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={farm.currentRiskLevel} size="sm" />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(farm.lastInspectionDate)}
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
