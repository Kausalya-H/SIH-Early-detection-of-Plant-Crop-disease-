# Rewrite MyFarmsPage to work with new backend (farms with crops array)
new_content = """import React, { useEffect, useState } from 'react';
import { farmService, Farm, Crop } from '../services/farmService';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { Sprout, Plus, Search, MapPin, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MyFarmsPage: React.FC = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Farm Modal
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmArea, setFarmArea] = useState('');

  // Add Crop Modal
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [cropName, setCropName] = useState('Tomato');
  const [cropVariety, setCropVariety] = useState('');
  const [cropAcreage, setCropAcreage] = useState('');

  const loadFarms = async () => {
    setIsLoading(true);
    const res = await farmService.getMyFarms();
    if (res.data) setFarms(res.data);
    setIsLoading(false);
  };

  useEffect(() => { loadFarms(); }, []);

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    await farmService.createFarm({
      farmName,
      location: farmLocation,
      latitude: 0,
      longitude: 0,
      area: parseFloat(farmArea) || 0,
    });
    setFarmName(''); setFarmLocation(''); setFarmArea('');
    setIsAddFarmOpen(false);
    loadFarms();
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    await farmService.addCrop(selectedFarmId, {
      cropName,
      variety: cropVariety || undefined,
      acreage: parseFloat(cropAcreage) || 0,
    });
    setCropName('Tomato'); setCropVariety(''); setCropAcreage('');
    setIsAddCropOpen(false);
    loadFarms();
  };

  const handleRemoveCrop = async (farmId: string, cropId: string) => {
    if (!confirm('Remove this crop from the farm?')) return;
    await farmService.removeCrop(farmId, cropId);
    loadFarms();
  };

  const openAddCrop = (farmId: string) => {
    setSelectedFarmId(farmId);
    setIsAddCropOpen(true);
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.crops || []).some((c) => c.cropName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Farms"
        subtitle="Manage your farms and crops"
        action={
          <button type="button" onClick={() => setIsAddFarmOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span>Add New Farm</span>
          </button>
        }
      />

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farm name, location, or crop..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading farms...</div>
      ) : filteredFarms.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Sprout className="h-12 w-12 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500">No farms found. Add your first farm to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFarms.map((farm) => (
            <div key={farm._id} className="card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{farm.farmName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-agri-600 shrink-0" />
                    <span>{farm.location || 'Location not set'}</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-stone-100 px-2 py-1 rounded-lg">
                  {farm.area || 0} {farm.areaUnit || 'acres'}
                </span>
              </div>

              {/* Crops List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Crops</span>
                  <button
                    type="button"
                    onClick={() => openAddCrop(farm._id)}
                    className="text-xs font-bold text-agri-700 hover:text-agri-900 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Crop
                  </button>
                </div>

                {(farm.crops || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No crops added yet</p>
                ) : (
                  (farm.crops || []).map((crop) => (
                    <div key={crop._id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{crop.cropName}</span>
                        {crop.variety && <span className="text-xs text-slate-500 ml-2">({crop.variety})</span>}
                        {crop.acreage > 0 && <span className="text-xs text-slate-400 ml-2">{crop.acreage} ac</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(farm._id, crop._id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Remove crop"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  to="/farmer/disease-detection"
                  className="rounded-xl bg-agri-50 border border-agri-300 px-3 py-1.5 text-xs font-bold text-agri-800 hover:bg-agri-100 transition-colors inline-flex items-center gap-1"
                >
                  <Sprout className="h-3.5 w-3.5" /> Scan Crop
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      <Modal isOpen={isAddFarmOpen} onClose={() => setIsAddFarmOpen(false)} title="Add New Farm" subtitle="Register a new farm plot">
        <form onSubmit={handleAddFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Farm Name *</label>
            <input type="text" required value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="e.g. North Tomato Plot" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Location *</label>
            <input type="text" required value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="e.g. Baramati, Maharashtra" className="input-field" />
       
