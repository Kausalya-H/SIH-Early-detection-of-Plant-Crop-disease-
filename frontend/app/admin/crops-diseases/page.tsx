'use client';

import React, { useMemo, useState } from 'react';
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
import { Disease } from '@/types';

const emptyDisease: Disease = {
  id: '',
  name: '',
  scientificName: '',
  category: 'FUNGAL',
  affectedCrops: [],
  symptoms: [],
  severityDefault: 'MODERATE',
  description: '',
  treatments: [],
};

export default function AdminCropsDiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>(
    MOCK_CROPS_DISEASES
  );

  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] =
    useState<'ADD' | 'EDIT' | 'VIEW'>('ADD');

  const [selectedDisease, setSelectedDisease] =
    useState<Disease | null>(null);

  const [form, setForm] = useState<Disease>(emptyDisease);

  /* ---------------------------------------------
     Create crop list dynamically
  --------------------------------------------- */

  const crops = useMemo(() => {
    const allCrops = diseases.flatMap(
      (disease) => disease.affectedCrops
    );

    return [...new Set(allCrops)].sort();
  }, [diseases]);

  /* ---------------------------------------------
     Filtering
  --------------------------------------------- */

  const filteredDiseases = useMemo(() => {
    const query = search.toLowerCase().trim();

    return diseases.filter((disease) => {
      const matchesSearch =
        !query ||
        disease.name.toLowerCase().includes(query) ||
        disease.scientificName?.toLowerCase().includes(query) ||
        disease.description.toLowerCase().includes(query);

      const matchesCrop =
        cropFilter === 'ALL' ||
        disease.affectedCrops.includes(cropFilter);

      const matchesSeverity =
        severityFilter === 'ALL' ||
        disease.severityDefault === severityFilter;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesSeverity
      );
    });
  }, [
    diseases,
    search,
    cropFilter,
    severityFilter,
  ]);

  /* ---------------------------------------------
     Modal helpers
  --------------------------------------------- */

  const openAddModal = () => {
    setModalMode('ADD');
    setSelectedDisease(null);
    setForm({
      ...emptyDisease,
      id: '',
      affectedCrops: [],
      symptoms: [],
      treatments: [],
    });

    setShowModal(true);
  };

  const openViewModal = (disease: Disease) => {
    setModalMode('VIEW');
    setSelectedDisease(disease);
    setShowModal(true);
  };

  const openEditModal = (disease: Disease) => {
    setModalMode('EDIT');
    setSelectedDisease(disease);
    setForm({
      ...disease,
      affectedCrops: [...disease.affectedCrops],
      symptoms: [...disease.symptoms],
      treatments: [...disease.treatments],
    });

    setShowModal(true);
  };

  /* ---------------------------------------------
     Delete
  --------------------------------------------- */

  const deleteDisease = (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this disease profile?'
    );

    if (!confirmed) return;

    setDiseases((current) =>
      current.filter((disease) => disease.id !== id)
    );
  };

  /* ---------------------------------------------
     Save
  --------------------------------------------- */

  const saveDisease = () => {
    if (!form.name.trim()) {
      alert('Disease name is required.');
      return;
    }

    if (form.affectedCrops.length === 0) {
      alert('Add at least one affected crop.');
      return;
    }

    if (modalMode === 'ADD') {
      const newDisease: Disease = {
        ...form,
        id: `dis-${Date.now()}`,
      };

      setDiseases((current) => [
        ...current,
        newDisease,
      ]);
    }

    if (
      modalMode === 'EDIT' &&
      selectedDisease
    ) {
      setDiseases((current) =>
        current.map((disease) =>
          disease.id === selectedDisease.id
            ? {
                ...form,
                id: selectedDisease.id,
              }
            : disease
        )
      );
    }

    setShowModal(false);
  };

  /* ---------------------------------------------
     Render
  --------------------------------------------- */

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="flex items-center gap-2">

            <DiseaseIcon className="w-5 h-5 text-purple-400" />

            <h2 className="text-base font-bold tracking-tight">
              National Crop & Disease Taxonomy Registry
            </h2>

          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Standardized ICAR phytopathological classification,
            symptom ontology, authorized chemical & biological
            treatments, and default severity parameters.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <Badge variant="primary" size="sm">
            {diseases.length} Disease Profiles
          </Badge>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100"
          >
            + Add Disease
          </button>

        </div>

      </div>

      {/* Filters */}
      <Card>

        <CardContent className="p-4">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search disease or scientific name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

            <select
              value={cropFilter}
              onChange={(e) =>
                setCropFilter(e.target.value)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">
                All Crops
              </option>

              {crops.map((crop) => (
                <option
                  key={crop}
                  value={crop}
                >
                  {crop}
                </option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">
                All Severity
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCropFilter('ALL');
                setSeverityFilter('ALL');
              }}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Clear
            </button>

          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing {filteredDiseases.length} of{' '}
            {diseases.length} disease profiles
          </div>

        </CardContent>

      </Card>

      {/* Disease Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredDiseases.length === 0 ? (

          <div className="col-span-full py-12 text-center text-sm text-slate-500">
            No disease profiles found.
          </div>

        ) : (

          filteredDiseases.map((disease) => (

            <Card
              key={disease.id}
              className="bg-white flex flex-col justify-between hover:border-slate-300 transition-colors"
            >

              <div>

                <CardHeader
                  action={
                    <RiskBadge
                      level={disease.severityDefault}
                      size="sm"
                    />
                  }
                >

                  <CardTitle className="text-base font-bold text-slate-900">
                    {disease.name}
                  </CardTitle>

                  <CardDescription className="italic font-serif">
                    {disease.scientificName ||
                      'Phytopathogen'}
                  </CardDescription>

                </CardHeader>

                <CardContent className="space-y-3">

                  <div className="space-y-1">

                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Affected Crops:
                    </p>

                    <div className="flex flex-wrap gap-1">

                      {disease.affectedCrops.map(
                        (crop) => (
                          <span
                            key={crop}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200"
                          >
                            {crop}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100">

                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Symptoms:
                    </p>

                    <ul className="space-y-1 text-xs text-slate-600">

                      {disease.symptoms.map(
                        (symptom, index) => (

                          <li
                            key={index}
                            className="flex items-start gap-1.5"
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />

                            <span>
                              {symptom}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                </CardContent>

              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">

                <div className="space-y-2 text-xs">

                  <p className="font-semibold text-slate-800">
                    Authorized Treatment:
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    {disease.treatments[0]?.title ||
                      'Standard treatment'}
                  </p>

                  <div className="flex gap-2 pt-2">

                    <button
                      type="button"
                      onClick={() =>
                        openViewModal(disease)
                      }
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-white"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(disease)
                      }
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteDisease(disease.id)
                      }
                      className="rounded-md border border-red-200 text-red-600 px-2.5 py-1.5 text-xs hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>

      {/* Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">

                  {modalMode === 'ADD'
                    ? 'Add Disease Profile'
                    : modalMode === 'EDIT'
                    ? 'Edit Disease Profile'
                    : 'Disease Details'}

                </h3>

                <p className="text-xs text-slate-500">
                  Manage crop disease registry information.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ×
              </button>

            </div>

            {modalMode === 'VIEW' &&
            selectedDisease ? (

              <div className="space-y-5 p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <Info
                    label="Disease"
                    value={selectedDisease.name}
                  />

                  <Info
                    label="Scientific Name"
                    value={
                      selectedDisease.scientificName ||
                      '—'
                    }
                  />

                  <Info
                    label="Category"
                    value={selectedDisease.category}
                  />

                  <Info
                    label="Severity"
                    value={
                      selectedDisease.severityDefault
                    }
                  />

                </div>

                <Info
                  label="Affected Crops"
                  value={
                    selectedDisease.affectedCrops.join(
                      ', '
                    )
                  }
                />

                <div>

                  <div className="text-[11px] font-semibold uppercase text-slate-500">
                    Symptoms
                  </div>

                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">

                    {selectedDisease.symptoms.map(
                      (symptom, index) => (
                        <li key={index}>
                          {symptom}
                        </li>
                      )
                    )}

                  </ul>

                </div>

                <Info
                  label="Description"
                  value={
                    selectedDisease.description ||
                    '—'
                  }
                />

                <div>

                  <div className="text-[11px] font-semibold uppercase text-slate-500">
                    Treatments
                  </div>

                  <div className="mt-2 space-y-3">

                    {selectedDisease.treatments.map(
                      (treatment, index) => (

                        <div
                          key={index}
                          className="rounded-md bg-slate-50 p-3"
                        >

                          <div className="text-sm font-semibold">
                            {treatment.title}
                          </div>

                          <div className="text-xs text-slate-600 mt-1">
                            {treatment.instructions}
                          </div>

                          {treatment.dosage && (
                            <div className="text-xs text-slate-500 mt-1">
                              Dosage: {treatment.dosage}
                            </div>
                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">

                <Field
                  label="Disease Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                />

                <Field
                  label="Scientific Name"
                  value={
                    form.scientificName || ''
                  }
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      scientificName: value,
                    }))
                  }
                />

                <Field
                  label="Affected Crops"
                  value={form.affectedCrops.join(
                    ', '
                  )}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      affectedCrops: value
                        .split(',')
                        .map((crop) =>
                          crop.trim()
                        )
                        .filter(Boolean),
                    }))
                  }
                />

                <label className="space-y-1">

                  <span className="text-xs font-semibold text-slate-700">
                    Category
                  </span>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        category:
                          e.target.value as Disease['category'],
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="FUNGAL">
                      Fungal
                    </option>

                    <option value="BACTERIAL">
                      Bacterial
                    </option>

                    <option value="VIRAL">
                      Viral
                    </option>

                    <option value="PEST">
                      Pest
                    </option>

                  </select>

                </label>

                <label className="space-y-1">

                  <span className="text-xs font-semibold text-slate-700">
                    Default Severity
                  </span>

                  <select
                    value={form.severityDefault}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        severityDefault:
                          e.target.value as Disease['severityDefault'],
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >

                    <option value="CRITICAL">
                      Critical
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="LOW">
                      Low
                    </option>

                  </select>

                </label>

                <div className="md:col-span-2">

                  <label className="space-y-1">

                    <span className="text-xs font-semibold text-slate-700">
                      Description
                    </span>

                    <textarea
                      value={
                        form.description
                      }
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          description:
                            e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />

                  </label>

                </div>

                <div className="md:col-span-2">

                  <label className="space-y-1">

                    <span className="text-xs font-semibold text-slate-700">
                      Symptoms
                    </span>

                    <textarea
                      value={form.symptoms.join(
                        '\n'
                      )}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          symptoms:
                            e.target.value
                              .split('\n')
                              .map((item) =>
                                item.trim()
                              )
                              .filter(Boolean),
                        }))
                      }
                      rows={5}
                      placeholder="One symptom per line"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />

                  </label>

                </div>

              </div>

            )}

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Close
              </button>

              {modalMode !== 'VIEW' && (

                <button
                  type="button"
                  onClick={saveDisease}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {modalMode === 'ADD'
                    ? 'Create Disease'
                    : 'Save Changes'}
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ---------------------------------------------
   Reusable components
--------------------------------------------- */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">

      <span className="text-xs font-semibold text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
      />

    </label>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-slate-50 p-3">

      <div className="text-[11px] font-semibold uppercase text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-900">
        {value}
      </div>

    </div>
  );
}