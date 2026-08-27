import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  RiskBadge,
  Badge,
} from '@/components/shared';
import { DiseaseIcon } from '@/components/shared/ui/Icons';
import { MOCK_CROPS_DISEASES } from '@/lib/mock';

export default function AdminCropsDiseasesPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DiseaseIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-tight">
              National Crop & Disease Taxonomy Registry
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Standardized ICAR phytopathological classification, symptom ontology, authorized chemical & biological treatments, and default severity parameters.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          54 Disease Profiles
        </Badge>
      </div>

      {/* Disease Cards Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CROPS_DISEASES.map((disease) => (
          <Card key={disease.id} className="bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <CardHeader
                action={
                  <RiskBadge level={disease.severityDefault} size="sm" />
                }
              >
                <CardTitle className="text-base font-bold text-slate-900">
                  {disease.name}
                </CardTitle>
                <CardDescription className="italic font-serif">
                  {disease.scientificName || 'Phytopathogen'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affected Crops:</p>
                  <div className="flex flex-wrap gap-1">
                    {disease.affectedCrops.map((crop) => (
                      <span key={crop} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Symptoms:</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {disease.symptoms.map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800">Authorized Treatment:</p>
                <p className="text-slate-500 text-[11px]">
                  {disease.treatments[0]?.title || 'Standard fungicides'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
