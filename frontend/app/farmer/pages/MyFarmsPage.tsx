import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { Farm } from '../types/farmer';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';
import { Sprout, Plus, Search, MapPin, Droplets, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyFarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Farm Form State
  const [name, setName] = useState('');
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [areaAcres, setAreaAcres] = useState('3.0');
  const [village, setVillage] = useState('Malegaon Khurd');
  const [taluka, setTaluka] = useState('Baramati');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [irrigationType, setIrrigationType] = useState<'DRIP' | 'SPRINKLER' | 'FLOOD' | 'RAINFED'>('DRIP');

  useEffect(() => {
    farmService.getFarms().then(setFarms);
  }, []);

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newFarm = await farmService.addFarm({
        farmName: name,
        area: parseFloat(areaAcres) || 2.5,
        location: `${village}, ${district}`,
      });
      // Also add the selected crop to the new farm
      if (newFarm && newFarm.id) {
        await farmService.addCrop(newFarm.id, { cropName: cropName, variety: variety || '', sowingDate: '' });
      }
      // Re-fetch farms to get the crop data
      const updatedFarms = await farmService.getFarms();
      setFarms(updatedFarms.length > 0 ? updatedFarms : [newFarm, ...farms]);
      setIsAddModalOpen(false);
      setName('');
    } catch (err) {
      console.error('Failed to create farm:', err);
      alert('Failed to create farm. Make sure you are logged in.');
    }
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.plotNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Farms"
        subtitle="Manage plot acreage, monitor crop growth stages, and schedule health scans"
        action={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Plot</span>
          </button>
        }
      />

      {/* Search Filter Bar */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farm name, village, or crop..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFarms.map((farm) => (
          <div key={farm.id} className="card p-6 card-hover flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{farm.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-agri-600 shrink-0" />
                    <span>{farm.plotNumber || 'Plot'} • {farm.village}, {farm.taluka}</span>
                  </p>
                </div>
                <StatusBadge status={farm.crop.health} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Crop & Variety</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{farm.crop.name}</span>
                  <span className="text-slate-500 text-xs">{farm.crop.variety || 'Hybrid'}</span>
                </div>

                <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Growth Stage</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{farm.crop.stage}</span>
                  <span className="text-slate-500 text-xs">Sown: {farm.crop.sowingDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <span className="font-semibold">{farm.areaAcres} Acres</span>
                <span>•</span>
                <span>{farm.irrigationType} Irrigation</span>
              </div>

              <div className="flex items-center gap-2">
                <RiskBadge level={farm.crop.currentRisk} size="sm" />
                <Link
                  to="/farmer/disease-detection"
                  className="rounded-xl bg-agri-50 border border-agri-300 px-3 py-1.5 text-xs font-bold text-agri-800 hover:bg-agri-100 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-agri-600" />
                  <span>Scan Crop</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farm Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Agricultural Plot"
        subtitle="Add a new farm parcel to your profile for automated health tracking"
      >
        <form onSubmit={handleAddFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Farm / Plot Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. South Mango Orchard, West Sugarcane Plot"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Crop Type *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="input-field"
              >
                <option value="Tomato">Tomato</option>
                <option value="Apple">Apple</option>
                <option value="Blueberry">Blueberry</option>
                <option value="Cherry">Cherry</option>
                <option value="Corn">Corn</option>
                <option value="Grape">Grape</option>
                <option value="Orange">Orange</option>
                <option value="Peach">Peach</option>
                <option value="Pepper">Pepper</option>
                <option value="Potato">Potato</option>
                <option value="Raspberry">Raspberry</option>
                <option value="Soybean">Soybean</option>
                <option value="Strawberry">Strawberry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Acreage (Area in Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Village *
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as any)}
                className="input-field"
              >
                <option value="DRIP">Drip Irrigation (ठिबक)</option>
                <option value="SPRINKLER">Sprinkler (तुषार)</option>
                <option value="FLOOD">Flood Irrigation (पाट पाणी)</option>
                <option value="RAINFED">Rainfed (जिरायती)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Plot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
