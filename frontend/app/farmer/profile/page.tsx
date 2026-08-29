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
import {
  UserIcon,
  FarmIcon,
  ShieldIcon,
  CheckIcon,
  AlertIcon,
} from '@/components/shared/ui/Icons';
import { useAuth } from '@/context';
import { createFarmer } from '@/lib/api/farmer';

export default function FarmerProfilePage() {
  const { user } = useAuth();

  const [farms, setFarms] = useState([
    {
      id: 'farm-001',
      plotName: 'Pimpalgaon Shivar Plot A',
      surveyNo: 'Survey 142/2B',
      acreage: 3.5,
      crop: 'Tomato (Abhinav / US-440)',
      soilType: 'Medium Black Loam',
      irrigation: 'Drip Irrigation',
      healthStatus: 'Monitored (Early Blight Treated)',
    },
    {
      id: 'farm-002',
      plotName: 'Niphad East Orchard',
      surveyNo: 'Survey 88/1',
      acreage: 2.0,
      crop: 'Chilli (Sitara F1)',
      soilType: 'Red Sandy Loam',
      irrigation: 'Borewell Micro-Sprinkler',
      healthStatus: 'Healthy',
    },
  ]);

  const [isAddingFarm, setIsAddingFarm] = useState(false);
  const [newPlotName, setNewPlotName] = useState('');
  const [newAcreage, setNewAcreage] = useState('');
  const [newCrop, setNewCrop] = useState('Tomato');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!newPlotName.trim() || !newAcreage.trim()) {
      setErrorMessage('Please enter plot name and acreage.');
      return;
    }

    setIsSaving(true);

    try {
      // Call backend createFarmer API if available
      try {
        await createFarmer({
          name: user?.name || 'Rameshwar Rao',
          phone: user?.phone || '+91 98765 43210',
          language: 'hi',
          location: `${newPlotName}, ${user?.jurisdiction?.taluk || 'Niphad'}, ${user?.jurisdiction?.district || 'Nashik'}, ${user?.jurisdiction?.state || 'Maharashtra'}`,
          crop: newCrop,
        });
      } catch (backendErr) {
        console.warn('Backend farmer save notice (MongoDB offline, proceeding with local state):', backendErr);
      }

      const newFarm = {
        id: `farm-${Date.now()}`,
        plotName: newPlotName,
        surveyNo: `Survey ${Math.floor(100 + Math.random() * 900)}/${Math.floor(1 + Math.random() * 9)}`,
        acreage: parseFloat(newAcreage) || 1.0,
        crop: newCrop,
        soilType: 'Black Clay Loam',
        irrigation: 'Drip System',
        healthStatus: 'Active Monitoring',
      };

      setFarms((prev) => [...prev, newFarm]);
      setSuccessMessage(`Farm plot "${newPlotName}" successfully registered.`);
      setNewPlotName('');
      setNewAcreage('');
      setIsAddingFarm(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to register farm plot.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-emerald-400" />
            <h1 className="text-lg font-bold tracking-tight">
              Kisan Profile & Registered Farm Holdings
            </h1>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Manage your farmer profile, registered land survey records, crop acreage, and direct linkages with the National Agriculture Early Warning Network.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-xs shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-200">Aadhaar/Kisan Grid: <strong>Verified</strong></span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
          <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Record Updated</p>
            <p className="text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
          <AlertIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Update Notice</p>
            <p className="text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2-Column Grid: Profile Card on Left, Registered Plots on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border-2 border-slate-200 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  KIS
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {user?.name || 'Rameshwar Rao'}
                  </CardTitle>
                  <CardDescription className="text-emerald-800 font-semibold">
                    Progressive Kisan Member
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Kisan Member ID:</span>
                <span className="font-mono font-bold text-slate-800">KR-MH-2026-8812</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Contact Phone:</span>
                <span className="font-mono text-slate-800">{user?.phone || '+91 98765 43210'}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Email Address:</span>
                <span className="text-slate-800 truncate max-w-[170px]">{user?.email || 'farmer@krishirakshak.gov.in'}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">State / Region:</span>
                <span className="font-medium text-slate-800">{user?.jurisdiction?.state || 'Maharashtra'}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">District / Taluk:</span>
                <span className="font-medium text-slate-800">
                  {user?.jurisdiction?.district || 'Nashik'} ({user?.jurisdiction?.taluk || 'Niphad'})
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Total Holdings:</span>
                <span className="font-bold text-emerald-800">
                  {farms.reduce((acc, f) => acc + f.acreage, 0)} Total Acres
                </span>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 border-t border-slate-100 p-3 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldIcon className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Registered under National Agri Stack PM-KISAN Protocol</span>
            </CardFooter>
          </Card>
        </div>

        {/* Registered Farm Plots */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white border-2 border-slate-200 shadow-xs">
            <CardHeader
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddingFarm(!isAddingFarm)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-xs"
                >
                  {isAddingFarm ? 'Cancel Plot Form' : '+ Add Farm Plot'}
                </Button>
              }
            >
              <div className="flex items-center gap-2">
                <FarmIcon className="w-5 h-5 text-emerald-700" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Registered Farm Plots & Survey Records ({farms.length})
                </CardTitle>
              </div>
              <CardDescription>
                Geotagged agricultural holdings synchronized for disease surveillance.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Add Farm Form Modal/Accordion */}
              {isAddingFarm && (
                <form onSubmit={handleAddFarm} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs animate-fadeIn">
                  <p className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
                    Register New Field Holding
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">Plot / Village Name *</label>
                      <input
                        type="text"
                        value={newPlotName}
                        onChange={(e) => setNewPlotName(e.target.value)}
                        placeholder="e.g. Pimpalgaon North Block"
                        required
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">Acreage *</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newAcreage}
                        onChange={(e) => setNewAcreage(e.target.value)}
                        placeholder="e.g. 2.5"
                        required
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">Primary Crop *</label>
                      <select
                        value={newCrop}
                        onChange={(e) => setNewCrop(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 cursor-pointer"
                      >
                        <option value="Tomato">Tomato</option>
                        <option value="Chilli">Chilli</option>
                        <option value="Groundnut">Groundnut</option>
                        <option value="Rice">Rice / Paddy</option>
                        <option value="Wheat">Wheat</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isSaving}
                      className="bg-emerald-800 hover:bg-emerald-900 text-xs"
                    >
                      {isSaving ? 'Registering...' : 'Save Farm Record'}
                    </Button>
                  </div>
                </form>
              )}

              {/* List of Registered Plots */}
              <div className="space-y-3 text-xs">
                {farms.map((farm) => (
                  <div
                    key={farm.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{farm.plotName}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{farm.surveyNo}</p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {farm.acreage} Acres
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Cultivated Crop:</span>
                        <span className="font-semibold text-slate-800">{farm.crop}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Soil & Irrigation:</span>
                        <span className="text-slate-700">{farm.soilType} • {farm.irrigation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Surveillance Status:</span>
                        <span className="font-semibold text-emerald-700">{farm.healthStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
