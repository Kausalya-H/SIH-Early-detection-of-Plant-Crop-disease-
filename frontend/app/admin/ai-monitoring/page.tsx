'use client';

import React, { useMemo, useState } from 'react';
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
  Button,
} from '@/components/shared';

import {
  CpuIcon,
  ActivityIcon,
  ShieldIcon,
} from '@/components/shared/ui/Icons';

import { MOCK_AI_MODELS } from '@/lib/mock';

export default function AdminAiMonitoringPage() {
  const [models, setModels] = useState(MOCK_AI_MODELS);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedModel, setSelectedModel] =
    useState<(typeof MOCK_AI_MODELS)[number] | null>(null);

  const [testingModelId, setTestingModelId] = useState<string | null>(null);

  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredModels = useMemo(() => {
    const query = search.toLowerCase().trim();

    return models.filter((model) => {
      const matchesSearch =
        !query ||
        model.modelName.toLowerCase().includes(query) ||
        model.version.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        model.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [models, search, statusFilter]);

  const refreshTelemetry = () => {
    setLastRefresh(new Date());

    // Simulate a small telemetry refresh.
    setModels((currentModels) =>
      currentModels.map((model) => ({
        ...model,
        lastInferenceAt: new Date().toISOString(),
      }))
    );
  };

  const runHealthCheck = (modelId: string) => {
    setTestingModelId(modelId);

    setTimeout(() => {
      setModels((currentModels) =>
        currentModels.map((model) =>
          model.id === modelId
            ? {
                ...model,
                status: 'HEALTHY',
                lastInferenceAt: new Date().toISOString(),
              }
            : model
        )
      );

      setTestingModelId(null);
    }, 1500);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  const healthyModels = models.filter(
    (model) => model.status === 'HEALTHY'
  ).length;

  const averageLatency =
    models.length > 0
      ? Math.round(
          models.reduce(
            (total, model) => total + model.latencyMs,
            0
          ) / models.length
        )
      : 0;

  const totalInferences = models.reduce(
    (total, model) => total + model.totalInferencesToday,
    0
  );

  const failedInferences = models.reduce(
    (total, model) => total + model.failedInferencesToday,
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="flex items-center gap-2">

            <CpuIcon className="w-5 h-5 text-purple-400" />

            <h2 className="text-base font-bold tracking-tight">
              AI Vision Model Telemetry & Inference Diagnostics
            </h2>

          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Real-time monitoring of Vision Transformer neural
            network inference latency, classification confidence
            distributions, model drift, and edge model deployments.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <Badge variant="primary" size="sm">
            {healthyModels}/{models.length} Healthy
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshTelemetry}
          >
            Refresh
          </Button>

        </div>

      </div>

      {/* Model KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Fleet Top-1 Accuracy"
          value="98.4%"
          subtitle="Benchmark tested"
          icon={
            <CpuIcon className="w-5 h-5 text-purple-700" />
          }
          accentColor="slate"
          trend={{
            value: '+0.3%',
            direction: 'up',
            label: 'vs v2.3',
          }}
        />

        <StatCard
          title="Average Inference Latency"
          value={`${averageLatency} ms`}
          subtitle="Across registered models"
          icon={
            <ActivityIcon className="w-5 h-5 text-blue-700" />
          }
          accentColor="blue"
        />

        <StatCard
          title="Daily Inferences"
          value={totalInferences.toLocaleString()}
          subtitle="Across all models"
          icon={
            <ShieldIcon className="w-5 h-5 text-emerald-700" />
          }
          accentColor="emerald"
        />

        <StatCard
          title="Failed Inferences"
          value={failedInferences.toLocaleString()}
          subtitle="Rejected or failed requests"
          icon={
            <ActivityIcon className="w-5 h-5 text-amber-700" />
          }
          accentColor="amber"
        />

      </div>

      {/* Filters */}
      <Card>

        <CardContent className="p-4">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search model or version..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="HEALTHY">Healthy</option>
              <option value="DEGRADED">Degraded</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear
            </Button>

          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">

            <span>
              Showing {filteredModels.length} of {models.length} models
            </span>

            <span>
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </span>

          </div>

        </CardContent>

      </Card>

      {/* Model Registry */}
      <Card>

        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              PyTorch / ONNX Runtime
            </span>
          }
        >

          <CardTitle>
            Deployed Model Registry
          </CardTitle>

          <CardDescription>
            Vision Transformer and Spatio-temporal model endpoints
            handling live farmer and field officer queries.
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
                <TableHead>Actions</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredModels.length === 0 ? (

                <TableRow>

                  <TableCell colSpan={9}>

                    <div className="py-8 text-center text-sm text-slate-500">
                      No models found.
                    </div>

                  </TableCell>

                </TableRow>

              ) : (

                filteredModels.map((model) => (

                  <TableRow key={model.id}>

                    <TableCell className="font-semibold text-slate-900 text-xs max-w-xs">
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
                      {model.targetCropsCount} crops /{' '}
                      {model.classesCount} diseases
                    </TableCell>

                    <TableCell className="font-medium text-xs text-slate-800">
                      {model.totalInferencesToday.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={model.status} />
                    </TableCell>

                    <TableCell>

                      <div className="flex gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedModel(model)
                          }
                        >
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            testingModelId === model.id
                          }
                          onClick={() =>
                            runHealthCheck(model.id)
                          }
                        >
                          {testingModelId === model.id
                            ? 'Testing...'
                            : 'Health Check'}
                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* Model Details Modal */}
      {selectedModel && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-start justify-between border-b px-6 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Model Details
                </h3>

                <p className="text-xs text-slate-500">
                  {selectedModel.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4 p-6 text-sm">

              <Detail label="Model" value={selectedModel.modelName} />

              <Detail label="Version" value={selectedModel.version} />

              <Detail
                label="Accuracy"
                value={`${selectedModel.accuracy}%`}
              />

              <Detail
                label="F1 Score"
                value={selectedModel.f1Score.toString()}
              />

              <Detail
                label="Latency"
                value={`${selectedModel.latencyMs} ms`}
              />

              <Detail
                label="Target Crops"
                value={selectedModel.targetCropsCount.toString()}
              />

              <Detail
                label="Disease Classes"
                value={selectedModel.classesCount.toString()}
              />

              <Detail
                label="Today's Inferences"
                value={selectedModel.totalInferencesToday.toLocaleString()}
              />

              <Detail
                label="Failed Inferences"
                value={selectedModel.failedInferencesToday.toString()}
              />

              <Detail
                label="Status"
                value={selectedModel.status}
              />

            </div>

            <div className="border-t px-6 py-4 text-xs text-slate-500">
              Last inference:{' '}
              {new Date(
                selectedModel.lastInferenceAt
              ).toLocaleString()}
            </div>

            <div className="flex justify-end border-t px-6 py-4">

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedModel(null)}
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

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-3">

      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-800 break-words">
        {value}
      </p>

    </div>
  );
}