import React, { useState } from 'react';
import { Modal } from './Modal';
import { farmService } from '../../services/farmService';
import { Farm, CropStage } from '../../types/farmer';
import { Plus } from 'lucide-react';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmAdded: (farm: Farm) => void;
}

export const AddFarmModal: React.FC<AddFarmModalProps> = ({ isOpen, onClose, onFarmAdded }) => {
  const [name, setName] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [village, setVillage] = useState('Malegaon Khurd');
  const [taluka, setTaluka] = useState('Baramati');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [areaAcres, setAreaAcres] = useState('2.0');
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState<CropStage>('VEGETATIVE');
  const [irrigationType, setIrrigationType] = useState<'DRIP' | 'SPRINKLER' | 'FLOOD' | 'RAINFED'>('DRIP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newFarm = await farmService.addFarm({
        farmerId: 'farmer_mh_413801',
        name,
        plotNumber: plotNumber || undefined,
        village,
        taluka,
        district,
        state,
        areaAcres: parseFloat(areaAcres) || 1.0,
        irrigationType,
        crop: {
          name: cropName,
          variety: variety || undefined,
          sowingDate,
          stage,
          health: 'HEALTHY',
          currentRisk: 'LOW',
        },
      });
      onFarmAdded(newFarm);
      onClose();
    } catch (err) {
      console.error('Failed to add farm', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Farm Plot"
      subtitle="Add your land parcel and crop details for health monitoring"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Plot / Farm Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. East Boundary Field (Tomato)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gat No. / Survey No.
            </label>
            <input
              type="text"
              placeholder="e.g. Gat No. 142/B"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Area (in Acres) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={areaAcres}
              onChange={(e) => setAreaAcres(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Taluka / Block *
            </label>
            <input
              type="text"
              required
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              District *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Crop Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Crop Type *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="input-field"
              >
                <option value="Tomato">Tomato</option>
                <option value="Chilli">Chilli</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Rice">Rice (Paddy)</option>
                <option value="Cotton">Cotton</option>
                <option value="Soybean">Soybean</option>
                <option value="Wheat">Wheat</option>
                <option value="Onion">Onion</option>
                <option value="Grapes">Grapes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Seed Variety / Hybrid
              </label>
              <input
                type="text"
                placeholder="e.g. Abhinav / US-440"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sowing Date
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as any)}
                className="input-field"
              >
                <option value="DRIP">Drip Irrigation</option>
                <option value="SPRINKLER">Sprinkler</option>
                <option value="FLOOD">Flood / Furrow</option>
                <option value="RAINFED">Rainfed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering...' : 'Register Plot'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
