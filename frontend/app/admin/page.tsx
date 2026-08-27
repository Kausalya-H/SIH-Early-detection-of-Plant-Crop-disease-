import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  StatusBadge,
  Badge,
} from '@/components/shared';
import {
  CpuIcon,
  UsersIcon,
  AuditIcon,
  SettingsIcon,
  ShieldIcon,
  DiseaseIcon,
} from '@/components/shared/ui/Icons';
import {
  MOCK_SYSTEM_USERS,
  MOCK_AUDIT_LOGS,
  MOCK_AI_MODELS,
  ADMIN_NAV_ITEMS,
} from '@/lib/mock';
import { formatDate } from '@/lib/utils';

export default function AdminPortalHome() {
  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              Central Administration & AI Governance Foundation
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            This portal provides system administrators with deep learning model diagnostics, RBAC user access provisioning, compliance audit trails, and national disease taxonomy registries.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded border border-slate-800 text-xs">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-slate-300">NIC Cloud Cluster: <strong>Online</strong></span>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Model Version"
          value="ViT v2.4.1"
          subtitle="98.4% Top-1 Accuracy"
          icon={<CpuIcon className="w-5 h-5 text-purple-700" />}
          accentColor="slate"
          trend={{ value: '142ms', direction: 'neutral', label: 'avg latency' }}
        />

        <StatCard
          title="Registered Officers"
          value={MOCK_SYSTEM_USERS.length}
          subtitle="Across 28 States & UTs"
          icon={<UsersIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
          trend={{ value: '+4', direction: 'up', label: 'this month' }}
        />

        <StatCard
          title="Daily Inferences"
          value="23,410"
          subtitle="99.9% Pipeline Uptime"
          icon={<DiseaseIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: '+12%', direction: 'up', label: 'vs last week' }}
        />

        <StatCard
          title="Audit Log Events"
          value="1,842"
          subtitle="All trails cryptographically signed"
          icon={<AuditIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />
      </div>

      {/* AI Models & Audit Logs Foundation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Model Telemetry Registry */}
          <Card>
            <CardHeader
              action={
                <Badge variant="primary" size="sm">
                  Active Production Grid
                </Badge>
              }
            >
              <CardTitle>AI Model Fleet & Inference Performance</CardTitle>
              <CardDescription>
                Real-time accuracy, latency, and throughput metrics across vision and epidemic predictors.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Identifier</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Crops / Classes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_AI_MODELS.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{model.modelName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{model.version}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700">
                        {model.accuracy}%
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {model.latencyMs} ms
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {model.targetCropsCount} crops / {model.classesCount} diseases
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={model.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Logs Preview */}
          <Card>
            <CardHeader>
              <CardTitle>System Audit & Compliance Stream</CardTitle>
              <CardDescription>
                Immutable administrative actions and security logs.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
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
                        <div className="font-medium text-slate-900 text-xs">{log.actorName}</div>
                        <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {log.action}
                        </code>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 max-w-[240px]">
                        {log.description}
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

        {/* Admin Navigation Spec Modules */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Architecture Modules</CardTitle>
              <CardDescription>
                Navigation modules established for future administrative capabilities.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {ADMIN_NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="p-2.5 rounded-md border border-slate-200 bg-slate-50/50 flex items-start gap-3 text-xs"
                >
                  <div className="p-1.5 rounded bg-white border border-slate-200 text-purple-800 shrink-0">
                    <SettingsIcon className="w-4 h-4" />
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
