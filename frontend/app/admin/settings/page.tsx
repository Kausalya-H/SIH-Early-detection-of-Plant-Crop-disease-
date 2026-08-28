'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@/components/shared';

import { SettingsIcon } from '@/components/shared/ui/Icons';

const DEFAULT_CONFIG = {
  humidity: 85,
  radius: 5,
  confidence: 92,
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const [saved, setSaved] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<
    'CONNECTED' | 'TESTING' | 'FAILED'
  >('CONNECTED');

  const [showCredentials, setShowCredentials] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const resetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setSaved(false);
  };

  const saveConfiguration = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const testGateway = () => {
    setGatewayStatus('TESTING');

    setTimeout(() => {
      setGatewayStatus('CONNECTED');
    }, 1500);
  };

  const updateCredentials = () => {
    if (!apiKey.trim() || !apiSecret.trim()) {
      alert('Please enter both API Key and API Secret.');
      return;
    }

    alert('API credentials updated successfully.');
    setApiKey('');
    setApiSecret('');
    setShowCredentials(false);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="flex items-center gap-2">

            <SettingsIcon className="w-5 h-5 text-purple-400" />

            <h2 className="text-base font-bold tracking-tight">
              System Settings & Global Governance Thresholds
            </h2>

          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Configure national epidemic alert sensitivity thresholds,
            SMS gateway API credentials, automated quarantine trigger
            rules, and model inference scaling policies.
          </p>

        </div>

        <Badge variant="primary" size="sm">
          System Configuration
        </Badge>

      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Risk Thresholds */}
        <Card>

          <CardHeader>

            <CardTitle>
              Epidemic Risk Thresholds
            </CardTitle>

            <CardDescription>
              Automated severity escalation triggers across
              agricultural districts.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4 text-xs">

            {/* Humidity */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-slate-800">
                    Critical Alert Spore Dispersal Threshold
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    Triggers Level-4 quarantine warnings
                  </p>
                </div>

                <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200 whitespace-nowrap">
                  &gt; {config.humidity}% Humidity
                </span>

              </div>

              <input
                type="range"
                min="50"
                max="100"
                value={config.humidity}
                onChange={(e) =>
                  setConfig((current) => ({
                    ...current,
                    humidity: Number(e.target.value),
                  }))
                }
                className="w-full mt-3"
              />

            </div>

            {/* Radius */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-slate-800">
                    Outbreak Cluster Radius
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    Buffer zone surrounding infected holdings
                  </p>
                </div>

                <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200 whitespace-nowrap">
                  {config.radius.toFixed(1)} km
                </span>

              </div>

              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={config.radius}
                onChange={(e) =>
                  setConfig((current) => ({
                    ...current,
                    radius: Number(e.target.value),
                  }))
                }
                className="w-full mt-3"
              />

            </div>

            {/* Confidence */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-slate-800">
                    Minimum AI Confidence for Auto-Advisory
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    Threshold for instant farmer recommendation
                  </p>
                </div>

                <span className="font-mono font-bold px-2 py-1 bg-white rounded border border-slate-200 whitespace-nowrap">
                  {config.confidence.toFixed(1)}%
                </span>

              </div>

              <input
                type="range"
                min="50"
                max="100"
                value={config.confidence}
                onChange={(e) =>
                  setConfig((current) => ({
                    ...current,
                    confidence: Number(e.target.value),
                  }))
                }
                className="w-full mt-3"
              />

            </div>

            {saved && (
              <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700">
                Configuration saved successfully.
              </div>
            )}

          </CardContent>

          <CardFooter>

            <Button
              variant="outline"
              size="sm"
              onClick={resetDefaults}
            >
              Reset to Defaults
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={saveConfiguration}
            >
              Save Configuration
            </Button>

          </CardFooter>

        </Card>

        {/* Gateways */}
        <Card>

          <CardHeader>

            <CardTitle>
              National Notification Gateways
            </CardTitle>

            <CardDescription>
              Status of emergency dispatch integrations across
              Indian telecom operators.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4 text-xs">

            {/* SMS */}
            <Gateway
              title="C-DOT / BSNL Emergency SMS Gateway"
              description="Direct priority telecom routing"
              status={
                gatewayStatus === 'TESTING'
                  ? 'Testing...'
                  : gatewayStatus === 'CONNECTED'
                  ? 'Connected'
                  : 'Failed'
              }
            />

            {/* WhatsApp */}
            <Gateway
              title="WhatsApp Business API (Kisan Seva)"
              description="Interactive diagnosis bot channel"
              status="Active"
            />

            {/* Weather */}
            <Gateway
              title="IMD Agro-Meteorological Satellite Feed"
              description="Real-time weather radar ingest"
              status="Streaming"
            />

          </CardContent>

          <CardFooter>

            <Button
              variant="outline"
              size="sm"
              onClick={testGateway}
              disabled={gatewayStatus === 'TESTING'}
            >
              {gatewayStatus === 'TESTING'
                ? 'Testing...'
                : 'Test Gateway Ping'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setShowCredentials(true)
              }
            >
              Update API Credentials
            </Button>

          </CardFooter>

        </Card>

      </div>

      {/* Credentials Modal */}
      {showCredentials && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Update API Credentials
                </h3>

                <p className="text-xs text-slate-500">
                  Enter the gateway credentials.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCredentials(false)
                }
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="space-y-4 p-6">

              <label className="block">

                <span className="text-xs font-semibold text-slate-700">
                  API Key
                </span>

                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) =>
                    setApiKey(e.target.value)
                  }
                  placeholder="Enter API key"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />

              </label>

              <label className="block">

                <span className="text-xs font-semibold text-slate-700">
                  API Secret
                </span>

                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) =>
                    setApiSecret(e.target.value)
                  }
                  placeholder="Enter API secret"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />

              </label>

            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowCredentials(false)
                }
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={updateCredentials}
              >
                Update Credentials
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ---------------------------------------------
   Gateway component
--------------------------------------------- */

function Gateway({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">

      <div>
        <p className="font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-slate-500 text-[11px]">
          {description}
        </p>
      </div>

      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 whitespace-nowrap">

        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />

        {status}

      </span>

    </div>
  );
}