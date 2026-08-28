import React, { useEffect, useState } from 'react';
import { advisoryService } from '../services/advisoryService';
import { AdvisoryItem, DiseaseKnowledgeItem } from '../types/advisory';
import { PageHeader } from '../components/common/PageHeader';
import { AdvisoryCard } from '../components/advisory/AdvisoryCard';
import { DiseaseDetailModal } from '../components/advisory/DiseaseDetailModal';
import { SearchInput } from '../components/common/SearchInput';
import { FilterBar } from '../components/common/FilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, BookCheck, ChevronRight } from 'lucide-react';

export const AdvisoryPage: React.FC = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'advisories' | 'library'>('advisories');
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [diseaseList, setDiseaseList] = useState<DiseaseKnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  // Modal
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKnowledgeItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [advData, disData] = await Promise.all([
          advisoryService.getAdvisories(),
          advisoryService.getDiseaseLibrary(),
        ]);
        setAdvisories(advData);
        setDiseaseList(disData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryOptions = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'CROP_HEALTH', label: 'Crop Health' },
    { id: 'DISEASE_PREVENTION', label: 'Disease Prevention' },
    { id: 'PEST_MANAGEMENT', label: 'Pest Management' },
    { id: 'IRRIGATION', label: 'Irrigation' },
  ];

  const cropOptions = [
    { id: 'ALL', label: 'All Crops' },
    { id: 'Tomato', label: 'Tomato' },
    { id: 'Chilli', label: 'Chilli' },
    { id: 'Groundnut', label: 'Groundnut' },
    { id: 'Rice', label: 'Rice' },
  ];

  const filteredAdvisories = advisories.filter((adv) => {
    const matchesCategory = selectedCategory === 'ALL' || adv.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      adv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.shortSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const filteredDiseases = diseaseList.filter((dis) => {
    const matchesCrop = selectedCrop === 'ALL' || dis.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      dis.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dis.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dis.commonSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesQuery;
  });

  if (isLoading) {
    return <LoadingState message="Loading agricultural advisory & disease library..." count={3} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.advisory.title}
        subtitle={t.advisory.subtitle}
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 max-w-md border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('advisories')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'advisories'
              ? 'bg-white text-agri-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4 text-agri-700" />
          <span>{t.advisory.tabAdvisories}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'library'
              ? 'bg-white text-agri-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookCheck className="h-4 w-4 text-agri-700" />
          <span>{t.advisory.tabDiseaseLibrary}</span>
        </button>
      </div>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t.advisory.searchPlaceholder}
      />

      {/* Tab 1: Seasonal Advisories */}
      {activeTab === 'advisories' && (
        <div className="space-y-4">
          <FilterBar
            options={categoryOptions}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {filteredAdvisories.length === 0 ? (
            <EmptyState
              title="No advisories found"
              description="No agronomic guidelines match your search query."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredAdvisories.map((adv) => (
                <AdvisoryCard key={adv.id} advisory={adv} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Searchable Crop Disease Library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <FilterBar
            options={cropOptions}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />

          {filteredDiseases.length === 0 ? (
            <EmptyState
              title="No diseases found"
              description="No pathogen profiles match your search."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDiseases.map((dis) => (
                <div
                  key={dis.id}
                  onClick={() => setSelectedDisease(dis)}
                  className="card cursor-pointer hover:border-agri-400 hover:shadow-card-hover transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-lg bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {dis.crop}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {dis.severityLevel} Severity
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-agri-700 transition-colors">
                      {dis.diseaseName}
                    </h4>

                    {dis.scientificName && (
                      <p className="text-xs italic text-slate-500 mt-0.5">{dis.scientificName}</p>
                    )}

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">Warning Signs:</p>
                      <ul className="list-disc pl-4 space-y-0.5 line-clamp-2">
                        {dis.commonSymptoms.slice(0, 2).map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-agri-700">
                    <span>View Treatment & Safety</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disease Detail Modal */}
      <DiseaseDetailModal
        disease={selectedDisease}
        isOpen={!!selectedDisease}
        onClose={() => setSelectedDisease(null)}
      />
    </div>
  );
};
