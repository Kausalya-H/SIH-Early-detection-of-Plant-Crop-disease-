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
import { AlertIcon } from '@/components/shared/ui/Icons';
import { MOCK_OFFICER_ALERTS } from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function OfficerAlertsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-amber-950 text-white border border-amber-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertIcon className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold tracking-tight">
              Emergency Broadcast Advisories & Multichannel Alerts
            </h2>
          </div>
          <p className="text-xs text-amber-200 leading-relaxed max-w-2xl">
            Dispatch urgent SMS, WhatsApp, and in-app advisories to registered farmers in high-risk blocks with chemical and biological treatment instructions.
          </p>
        </div>

        <Badge variant="warning" size="sm">
          {MOCK_OFFICER_ALERTS.length} Active Broadcasts
        </Badge>
      </div>

      {/* Alerts Dispatch Log Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-700">
              Multilingual SMS Gateway Active
            </span>
          }
        >
          <CardTitle>Broadcast Advisories & Dispatch Log</CardTitle>
          <CardDescription>
            Emergency disease warnings sent to farming communities across affected taluks and districts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advisory Title & Details</TableHead>
                <TableHead>Target Region</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_OFFICER_ALERTS.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="max-w-md">
                    <div className="font-semibold text-slate-900 text-xs">{alert.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{alert.message}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-slate-800">
                      {alert.targetRegion.district || 'All Districts'}, {alert.targetRegion.state}
                    </div>
                    {alert.targetRegion.taluk && (
                      <div className="text-[11px] text-slate-500">{alert.targetRegion.taluk} Block</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-800 text-xs">
                      {alert.cropTargeted || 'All Crops'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {alert.channelsSent.map((ch) => (
                        <span
                          key={ch}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-emerald-700">
                      {alert.deliveredCount} / {alert.recipientsCount}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {Math.round((alert.deliveredCount / alert.recipientsCount) * 100)}% Delivered
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(alert.createdAt)}
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
