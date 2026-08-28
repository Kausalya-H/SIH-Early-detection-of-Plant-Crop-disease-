'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  Button,
} from '@/components/shared';

import { AuditIcon } from '@/components/shared/ui/Icons';
import { getAdminAuditLogs } from '@/lib/api';
import { AuditLog } from '@/types';
import { MOCK_AUDIT_LOGS } from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminAuditLogs();
      if (data && data.length > 0) {
        setLogs(data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load audit logs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.actorName.toLowerCase().includes(query) ||
        log.actorRole.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        (log.ipAddress?.toLowerCase().includes(query) ?? false);

      const matchesRole =
        roleFilter === 'ALL' || log.actorRole === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' || log.status === statusFilter;

      const matchesAction =
        actionFilter === 'ALL' || log.action === actionFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesAction
      );
    });
  }, [logs, search, roleFilter, statusFilter, actionFilter]);

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setActionFilter('ALL');
  };

  const availableActions = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.action)));
  }, [logs]);


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
            Cryptographically signed audit trail recording all
            administrative role escalations, model deployments,
            quarantine orders, and broadcast advisories.
          </p>

        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            SHA-256 Verified
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>

        <CardContent className="p-4">

          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search actor, action, entity, description, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Officer</option>
            </select>

            {/* Action */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Actions</option>

              {availableActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}

            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILURE">Failure</option>
            </select>

            {/* Clear */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear
            </Button>

          </div>

          <div className="mt-3 text-xs text-slate-500">
            {loading
              ? 'Loading audit events...'
              : `Showing ${filteredLogs.length} of ${logs.length} audit events`}
          </div>

        </CardContent>

      </Card>

      {/* Audit Log Table */}
      <Card>

        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              Immutable Log Stream
            </span>
          }
        >

          <CardTitle>
            System Audit Events
          </CardTitle>

          <CardDescription>
            Historical record of all system modifications,
            access grants, and national alerts.
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
                <TableHead>Details</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell colSpan={8}>

                    <div className="py-8 text-center text-sm text-slate-500">
                      Loading audit events from backend...
                    </div>

                  </TableCell>

                </TableRow>

              ) : filteredLogs.length === 0 ? (

                <TableRow>

                  <TableCell colSpan={8}>

                    <div className="py-8 text-center text-sm text-slate-500">
                      No audit events found.
                    </div>

                  </TableCell>

                </TableRow>

              ) : (

                filteredLogs.map((log) => (

                  <TableRow key={log.id}>

                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </TableCell>

                    <TableCell>

                      <div className="font-semibold text-slate-900 text-xs">
                        {log.actorName}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        {log.actorRole}
                      </div>

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

                    <TableCell>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        View
                      </Button>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* Details Modal */}
      {selectedLog && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-start justify-between border-b px-6 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Audit Event Details
                </h3>

                <p className="text-xs text-slate-500">
                  Event ID: {selectedLog.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="space-y-4 p-6 text-sm">

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Actor
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedLog.actorName}
                </p>

                <p className="text-xs text-slate-500">
                  {selectedLog.actorRole}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Action
                </p>

                <code className="text-xs font-bold">
                  {selectedLog.action}
                </code>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Target Entity
                </p>

                <p className="font-mono text-xs">
                  {selectedLog.entityType}
                  {selectedLog.entityId
                    ? ` / ${selectedLog.entityId}`
                    : ''}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Description
                </p>

                <p className="text-slate-700">
                  {selectedLog.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    IP Address
                  </p>

                  <p className="font-mono text-xs">
                    {selectedLog.ipAddress || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Timestamp
                  </p>

                  <p className="text-xs">
                    {formatDate(selectedLog.timestamp)}
                  </p>
                </div>

              </div>

              <div>

                <p className="text-xs font-semibold text-slate-500">
                  Status
                </p>

                <StatusBadge status={selectedLog.status} />

              </div>

            </div>

            <div className="flex justify-end border-t px-6 py-4">

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}