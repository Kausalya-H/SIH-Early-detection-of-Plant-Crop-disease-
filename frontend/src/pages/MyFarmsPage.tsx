import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { Farm } from '../types/farmer';
import { PageHeader } from '../components/common/PageHeader';
import { FarmCard } from '../components/farms/FarmCard';
import { SearchInput } from '../components/common/SearchInput';
import { FilterBar } from '../components/common/FilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { AddFarmModal } from '../components/common/AddFarmModal';
import { Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MyFarmsPage: React.FC = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const crops = ['ALL', 'Tomato', 'Chilli', 'Groundnut', 'Rice'];
  const cropFilterOptions = crops.map((c) => ({
    id: c,
    label: c === 'ALL' ? t.farms.allCrops : c,
    count: c === 'ALL' ? farms.length : farms.filter((f) => f.crop.name === c).length,
  }));

  const filteredFarms = farms.filter((farm) => {
    const matchesQuery =
      searchQuery === '' ||
      farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.crop.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = selectedCrop === 'ALL' || farm.crop.name === selectedCrop;

    return matchesQuery && matchesCrop;
  });

  if (isLoading) {
    return <LoadingState message="Loading your registered farms..." count={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.farms.title}
        subtitle={t.farms.subtitle}
        action={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs sm:text-sm py-2.5 px-4 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t.farms.addFarm}</span>
          </button>
        }
      />

      {/* Search & Filter */}
      <div className="space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.farms.searchPlaceholder}
        />

        <FilterBar
          options={cropFilterOptions}
          selectedId={selectedCrop}
          onSelect={setSelectedCrop}
        />
      </div>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <EmptyState
          title="No farms found"
          description={t.farms.noFarmsFound}
          actionText={t.farms.addFarm}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFarms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      <AddFarmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFarmAdded={(newFarm) => setFarms([newFarm, ...farms])}
      />
    </div>
  );
};
