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
import { CpuIcon, ActivityIcon, ShieldIcon } from '@/components/shared/ui/Icons';
import { MOCK_AI_MODELS } from '@/lib/mock';

export default function AdminAiMonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CpuIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              AI Vision Model Telemetry & Inference Diagnostics
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Real-time monitoring of Vision Transformer neural network inference latency, classification confidence distributions, model drift, and edge model deployments.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          3 Active Production Models
        </Badge>
      </div>

      {/* Model KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Top-1 Accuracy"
          value="98.4%"
          subtitle="Benchmark tested"
          icon={<CpuIcon className="w-5 h-5 text-purple-700" />}
          accentColor="slate"
          trend={{ value: '+0.3%', direction: 'up', label: 'vs v2.3' }}
        />

        <StatCard
          title="Average Inference Latency"
          value="142 ms"
          subtitle="GPU Cluster"
          icon={<ActivityIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
          trend={{ value: '38ms', direction: 'neutral', label: 'edge' }}
        />

        <StatCard
          title="Daily Inferences"
          value="23,410"
          subtitle="Across all states"
          icon={<ShieldIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: '99.9%', direction: 'up', label: 'success rate' }}
        />

        <StatCard
          title="Failed Inferences"
          value="22"
          subtitle="Blur/Unusable image rejected"
          icon={<ActivityIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />
      </div>

      {/* Models Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              PyTorch / ONNX Runtime
            </span>
          }
        >
          <CardTitle>Deployed Model Registry</CardTitle>
          <CardDescription>
            Vision Transformer and Spatio-temporal model endpoints handling live farmer and field officer queries.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Identifier</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>F1 Score</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Daily Volume</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AI_MODELS.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-semibold text-slate-900 text-xs">
                    {model.modelName}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {model.version}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-700 text-xs">
                    {model.accuracy}%
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-700">
                    {model.f1Score}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-800">
                    {model.latencyMs} ms
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {model.targetCropsCount} crops / {model.classesCount} diseases
                  </TableCell>
                  <TableCell className="font-medium text-xs text-slate-800">
                    {model.totalInferencesToday.toLocaleString()}
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
    </div>
  );
}
