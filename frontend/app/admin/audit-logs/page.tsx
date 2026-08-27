import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
  Badge,
} from '@/components/shared';
import { AuditIcon } from '@/components/shared/ui/Icons';
import { MOCK_AUDIT_LOGS } from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AuditIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              Compliance, Security & Administrative Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Cryptographically signed audit trail recording all administrative role escalations, model deployments, quarantine orders, and broadcast advisories.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          SHA-256 Verified
        </Badge>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              Immutable Log Stream
            </span>
          }
        >
          <CardTitle>System Audit Events</CardTitle>
          <CardDescription>
            Historical record of all system modifications, access grants, and national alerts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_LOGS.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">{log.actorName}</div>
                    <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      {log.action}
                    </code>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-600">
                    {log.entityType}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 max-w-sm">
                    {log.description}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-500">
                    {log.ipAddress || '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
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
