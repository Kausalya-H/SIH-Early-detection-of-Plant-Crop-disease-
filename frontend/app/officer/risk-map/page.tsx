'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  RiskBadge,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@/components/shared';
import {
  MapIcon,
  SearchIcon,
  XIcon,
  OutbreakIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  ActivityIcon,
} from '@/components/shared/ui/Icons';
import { MOCK_RISK_ZONES, MOCK_OUTBREAKS } from '@/lib/mock';
import { RiskZone } from '@/types';
import { cn } from '@/lib/utils';

type MapLayer = 'disease_risk' | 'spore_dispersion' | 'weather_vulnerability';

interface MapPosition {
  topPercent: number;
  leftPercent: number;
  humidityPercent: number;
  windDirection: string;
  dispersionRadiusKm: number;
}

const ZONE_POSITIONS: Record<string, MapPosition> = {
  'rz-001': { // Nashik, Maharashtra
    topPercent: 53,
    leftPercent: 31,
    humidityPercent: 89,
    windDirection: 'ESE (14 km/h)',
    dispersionRadiusKm: 15,
  },
  'rz-002': { // Ludhiana, Punjab
    topPercent: 18,
    leftPercent: 33,
    humidityPercent: 68,
    windDirection: 'NW (8 km/h)',
    dispersionRadiusKm: 10,
  },
  'rz-003': { // Thanjavur, Tamil Nadu
    topPercent: 84,
    leftPercent: 47,
    humidityPercent: 78,
    windDirection: 'SW (18 km/h)',
    dispersionRadiusKm: 5,
  },
  'rz-004': { // Warangal, Telangana
    topPercent: 61,
    leftPercent: 49,
    humidityPercent: 74,
    windDirection: 'WNW (12 km/h)',
    dispersionRadiusKm: 12,
  },
  'rz-005': { // Agra, Uttar Pradesh
    topPercent: 32,
    leftPercent: 45,
    humidityPercent: 55,
    windDirection: 'NE (6 km/h)',
    dispersionRadiusKm: 0,
  },
};

export default function OfficerRiskMapPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('rz-001'); // Default to Nashik
  const [activeLayer, setActiveLayer] = useState<MapLayer>('disease_risk');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Zone Object
  const selectedZone: RiskZone = useMemo(() => {
    return MOCK_RISK_ZONES.find((z) => z.id === selectedZoneId) || MOCK_RISK_ZONES[0];
  }, [selectedZoneId]);

  // Match corresponding outbreak if available
  const matchingOutbreak = useMemo(() => {
    return MOCK_OUTBREAKS.find(
      (o) => o.location.district.toLowerCase() === selectedZone.district.toLowerCase()
    );
  }, [selectedZone]);

  // Filtered zones for search
  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MOCK_RISK_ZONES.filter((z) => {
      return (
        z.name.toLowerCase().includes(q) ||
        z.district.toLowerCase().includes(q) ||
        z.state.toLowerCase().includes(q) ||
        z.affectedCrops.some((crop) => crop.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-400">
              <MapIcon className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold tracking-tight text-white">
              Geospatial Epidemic Risk Map & Zone Surveillance
            </h1>
            <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Demonstration Risk Map
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Interactive multi-layer geospatial projection of pathogen incidence, atmospheric spore dispersion vectors, and micro-climate vulnerability indices across agricultural districts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-slate-400 font-mono text-[11px] bg-slate-800 px-2.5 py-1.5 rounded border border-slate-700">
            5 Monitored Regional Clusters
          </span>
        </div>
      </div>

      {/* 2. Controls Bar: Search & Layer Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
        {/* District / Cluster Search */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district, state, or crop (e.g. Nashik, Wheat, Warangal)..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchQuery && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {filteredZones.length === 0 ? (
                <div className="p-3 text-center text-slate-500 text-xs">
                  No matching regional cluster found.
                </div>
              ) : (
                filteredZones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleSelectZone(zone.id)}
                    className="w-full p-2.5 text-left hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{zone.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {zone.district}, {zone.state} • {zone.affectedCrops.join(', ')}
                      </p>
                    </div>
                    <RiskBadge level={zone.riskLevel} size="sm" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Layer:</span>
          <button
            type="button"
            onClick={() => setActiveLayer('disease_risk')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0 select-none',
              activeLayer === 'disease_risk'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            Disease Risk
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('spore_dispersion')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0 select-none',
              activeLayer === 'spore_dispersion'
                ? 'bg-indigo-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            Spore Dispersion
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('weather_vulnerability')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0 select-none',
              activeLayer === 'weather_vulnerability'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            Weather Vulnerability
          </button>
        </div>
      </div>

      {/* 3. Main Map & Detailed Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden flex flex-col">
            <CardHeader
              action={
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Active Layer:</span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                    {activeLayer === 'disease_risk' && 'Pathogen Severity'}
                    {activeLayer === 'spore_dispersion' && 'Aerosol Dispersion Radius'}
                    {activeLayer === 'weather_vulnerability' && 'Micro-Climate Index'}
                  </span>
                </div>
              }
            >
              <CardTitle>Interactive National Surveillance Canvas</CardTitle>
              <CardDescription>
                Click any regional cluster marker to inspect field epidemiology and containment telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 relative">
              {/* Interactive India Geospatial Schematic Canvas */}
              <div className="relative w-full h-[460px] sm:h-[500px] bg-slate-950 overflow-hidden select-none">
                {/* Background Grid Lines representing latitude/longitude */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full border-b border-dashed border-emerald-500/30 grid grid-cols-6 grid-rows-6">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-slate-700/40" />
                    ))}
                  </div>
                </div>

                {/* India Geographic Outline Silhouette Schematic */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
                  viewBox="0 0 600 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 280 40 L 320 60 L 310 100 L 360 120 L 340 180 L 410 190 L 460 230 L 450 260 L 380 280 L 360 340 L 320 440 L 300 520 L 280 500 L 260 420 L 220 340 L 200 290 L 190 230 L 240 180 L 230 130 Z"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="#064e3b"
                    fillOpacity="0.15"
                  />
                  {/* Tropic of Cancer indicator */}
                  <line x1="120" y1="300" x2="480" y2="300" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                  <text x="130" y="295" fill="#f59e0b" fontSize="8" fontFamily="monospace" opacity="0.6">23.5° N (Tropic of Cancer)</text>
                </svg>

                {/* Regional Markers Layer */}
                {MOCK_RISK_ZONES.map((zone) => {
                  const pos = ZONE_POSITIONS[zone.id] || { topPercent: 50, leftPercent: 50, humidityPercent: 70, windDirection: 'N', dispersionRadiusKm: 5 };
                  const isSelected = selectedZoneId === zone.id;

                  // Marker color themes
                  const badgeColor = {
                    CRITICAL: 'bg-rose-600 text-white border-rose-400 ring-rose-500',
                    HIGH: 'bg-amber-600 text-white border-amber-400 ring-amber-500',
                    MODERATE: 'bg-yellow-600 text-white border-yellow-400 ring-yellow-500',
                    LOW: 'bg-emerald-600 text-white border-emerald-400 ring-emerald-500',
                  }[zone.riskLevel];

                  return (
                    <div
                      key={zone.id}
                      style={{
                        top: `${pos.topPercent}%`,
                        left: `${pos.leftPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-20 flex flex-col items-center group cursor-pointer"
                    >
                      {/* Dispersion Radius Circle in Spore Dispersion Mode */}
                      {activeLayer === 'spore_dispersion' && pos.dispersionRadiusKm > 0 && (
                        <div
                          style={{
                            width: `${pos.dispersionRadiusKm * 7}px`,
                            height: `${pos.dispersionRadiusKm * 7}px`,
                          }}
                          className={cn(
                            'absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full border border-dashed pointer-events-none transition-all duration-300 animate-pulse',
                            zone.riskLevel === 'CRITICAL'
                              ? 'border-rose-400/80 bg-rose-500/10'
                              : zone.riskLevel === 'HIGH'
                              ? 'border-amber-400/80 bg-amber-500/10'
                              : 'border-yellow-400/60 bg-yellow-500/10'
                          )}
                        />
                      )}

                      {/* Interactive Marker Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectZone(zone.id)}
                        aria-label={`Select ${zone.name}, Risk Level: ${zone.riskLevel}`}
                        className={cn(
                          'relative p-2 rounded-full border-2 transition-all duration-150 shadow-lg cursor-pointer focus:outline-none focus:ring-2',
                          badgeColor,
                          isSelected
                            ? 'scale-125 ring-4 ring-white shadow-emerald-500/50'
                            : 'hover:scale-110 opacity-90 hover:opacity-100'
                        )}
                      >
                        <OutbreakIcon className="w-3.5 h-3.5" />
                        {/* Pulse effect for High/Critical */}
                        {(zone.riskLevel === 'CRITICAL' || zone.riskLevel === 'HIGH') && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                          </span>
                        )}
                      </button>

                      {/* Floating Marker Label Tag */}
                      <div
                        onClick={() => handleSelectZone(zone.id)}
                        className={cn(
                          'mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-tight whitespace-nowrap shadow-md transition-all border select-none',
                          isSelected
                            ? 'bg-white text-slate-900 border-emerald-400 font-extrabold scale-105'
                            : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
                        )}
                      >
                        {zone.district}
                        {activeLayer === 'weather_vulnerability' && (
                          <span className="ml-1 text-[9px] text-blue-300 font-mono">
                            ({pos.humidityPercent}% RH)
                          </span>
                        )}
                        {activeLayer === 'spore_dispersion' && pos.dispersionRadiusKm > 0 && (
                          <span className="ml-1 text-[9px] text-amber-300 font-mono">
                            ({pos.dispersionRadiusKm}km)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* In-Canvas Dynamic Legend */}
                <div className="absolute bottom-3 left-3 bg-slate-900/95 p-3 rounded-lg border border-slate-800 text-white shadow-xl z-20 space-y-2 text-[11px] max-w-[240px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                      {activeLayer === 'disease_risk' && 'Pathogen Severity'}
                      {activeLayer === 'spore_dispersion' && 'Aerosol Dispersion'}
                      {activeLayer === 'weather_vulnerability' && 'Agro-Met Radar'}
                    </span>
                    <span className="text-[9px] text-slate-400">Layer 1.0</span>
                  </div>

                  {activeLayer === 'disease_risk' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-slate-300">Critical Epidemic Outbreak</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-slate-300">High Active Warning Zone</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-slate-300">Moderate Early Symptoms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-300">Low / Controlled Baseline</span>
                      </div>
                    </div>
                  )}

                  {activeLayer === 'spore_dispersion' && (
                    <div className="space-y-1 text-[10px] text-slate-300">
                      <p>Dashed Rings indicate estimated airborne pathogen propagation radius over 48h window based on wind velocity.</p>
                      <p className="font-semibold text-amber-300">Nashik Buffer: 15 km Radius</p>
                    </div>
                  )}

                  {activeLayer === 'weather_vulnerability' && (
                    <div className="space-y-1 text-[10px] text-slate-300">
                      <p>Surge index calculated from IMD microclimate relative humidity &gt;85% favoring fungal sporulation.</p>
                      <p className="font-semibold text-blue-300">Critical RH: Nashik (89%), Thanjavur (78%)</p>
                    </div>
                  )}
                </div>

                {/* GPS Coordinates Readout for Selected Region */}
                <div className="absolute top-3 right-3 bg-slate-900/90 px-2.5 py-1.5 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300 z-20 hidden sm:flex items-center gap-2">
                  <span className="text-emerald-400">GPS:</span>
                  <span>{selectedZone.coordinates.lat.toFixed(3)}° N, {selectedZone.coordinates.lng.toFixed(3)}° E</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Selected Region Dossier & Outbreak Action Panel */}
        <div className="space-y-6">
          <Card className="border-emerald-200 shadow-xs flex flex-col justify-between">
            <div>
              <CardHeader
                action={
                  <RiskBadge level={selectedZone.riskLevel} size="md" />
                }
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                    <MapIcon className="w-4 h-4" />
                  </span>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {selectedZone.name}
                  </CardTitle>
                </div>
                <CardDescription>
                  {selectedZone.district} District, {selectedZone.state}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                {/* Coordinates & Holdings Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Monitored Holdings:
                    </span>
                    <p className="font-semibold text-slate-900 text-sm mt-0.5">
                      {selectedZone.monitoredFarmsCount.toLocaleString()} Farms
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Active Clusters:
                    </span>
                    <p className={`font-semibold text-sm mt-0.5 ${selectedZone.activeOutbreaksCount > 0 ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                      {selectedZone.activeOutbreaksCount} Outbreaks
                    </p>
                  </div>
                </div>

                {/* Affected Crops */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Primary Monitored Crops:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedZone.affectedCrops.map((crop) => (
                      <span
                        key={crop}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Outbreak Dossier if available */}
                {matchingOutbreak ? (
                  <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                        {matchingOutbreak.code}
                      </span>
                      <StatusBadge status={matchingOutbreak.status} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {matchingOutbreak.crop} — {matchingOutbreak.diseaseName}
                      </h4>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Village: {matchingOutbreak.location.village || matchingOutbreak.location.talukOrBlock}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-rose-100">
                      <div>
                        <span className="text-slate-500">Affected Farms:</span>
                        <p className="font-semibold text-slate-800">{matchingOutbreak.affectedFarmsCount} Farms</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Acreage:</span>
                        <p className="font-semibold text-slate-800">{matchingOutbreak.totalAcreageAffected} Acres</p>
                      </div>
                    </div>

                    {/* Containment progress */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-700">Containment Progress:</span>
                        <span className="text-rose-700">{matchingOutbreak.containmentProgressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${matchingOutbreak.containmentProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {matchingOutbreak.officerInCharge && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-rose-100">
                        <span className="text-slate-400">Officer in Charge: </span>
                        <strong>{matchingOutbreak.officerInCharge.name}</strong> ({matchingOutbreak.officerInCharge.phone})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">No Critical Outbreak Pending</p>
                    <p className="text-[11px]">Standard surveillance and routine cultural practices active.</p>
                  </div>
                )}

                {/* Climatic Telemetry Simulation for this zone */}
                {ZONE_POSITIONS[selectedZone.id] && (
                  <div className="p-2.5 rounded bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-blue-900">Agro-Met Telemetry:</span>
                      <span className="font-mono text-blue-800 font-bold">
                        {ZONE_POSITIONS[selectedZone.id].humidityPercent}% RH
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-800">
                      Surface Wind: {ZONE_POSITIONS[selectedZone.id].windDirection}
                    </p>
                  </div>
                )}
              </CardContent>
            </div>

            {/* 4. Action button to view outbreak */}
            <CardFooter className="pt-2">
              {matchingOutbreak ? (
                <Link href="/officer/outbreaks" className="w-full">
                  <Button variant="primary" size="sm" className="w-full justify-between">
                    <span>View Outbreak Dossier ({matchingOutbreak.code})</span>
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/officer/farms" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Inspect Monitored Farms</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 6. Regional Agro-Clusters Table (Interactive Selection) */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              Click any cluster to select on map
            </span>
          }
        >
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-emerald-700" />
            <CardTitle>Regional Agro-Clusters Master Registry</CardTitle>
          </div>
          <CardDescription>
            Multi-state surveillance clusters categorized by phytopathological risk criteria.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster Name & ID</TableHead>
                <TableHead>Administrative Location</TableHead>
                <TableHead>Risk Classification</TableHead>
                <TableHead>Monitored Holdings</TableHead>
                <TableHead>Active Outbreaks</TableHead>
                <TableHead>Affected Crops</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RISK_ZONES.map((zone) => {
                const isSelected = selectedZoneId === zone.id;

                return (
                  <TableRow
                    key={zone.id}
                    onClick={() => handleSelectZone(zone.id)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-emerald-50/80 hover:bg-emerald-100/70 border-l-4 border-l-emerald-600'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">{zone.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{zone.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-800 text-xs">{zone.district}</div>
                      <div className="text-[11px] text-slate-500">{zone.state}</div>
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={zone.riskLevel} size="sm" />
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-slate-800">
                      {zone.monitoredFarmsCount.toLocaleString()} Farms
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold text-xs ${zone.activeOutbreaksCount > 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                        {zone.activeOutbreaksCount} Clusters
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {zone.affectedCrops.map((c) => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectZone(zone.id);
                        }}
                        className={cn(
                          'px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer select-none',
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                      >
                        {isSelected ? 'Selected' : 'Focus Map'}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Selected: <strong>{selectedZone.name}</strong> ({selectedZone.district}, {selectedZone.state})
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            GPS: {selectedZone.coordinates.lat}° N, {selectedZone.coordinates.lng}° E
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
