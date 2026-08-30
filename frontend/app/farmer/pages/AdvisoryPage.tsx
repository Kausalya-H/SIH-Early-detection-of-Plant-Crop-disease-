import React, { useEffect, useState } from 'react';
import { advisoryService } from '../services/advisoryService';
import { AdvisoryItem, DiseaseKnowledgeItem } from '../types/advisory';
import { PageHeader } from '../components/common/PageHeader';
import { NLPQueryAssistant } from '../components/advisory/NLPQueryAssistant';
import { AdvisoryCard } from '../components/advisory/AdvisoryCard';
import { DiseaseDetailModal } from '../components/advisory/DiseaseDetailModal';
import { SearchInput } from '../components/common/SearchInput';
import { FilterBar } from '../components/common/FilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { useLanguage } from '../context/LanguageContext';
import { Bot, BookOpen, BookCheck, ChevronRight, Sparkles } from 'lucide-react';

export const AdvisoryPage: React.FC = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'nlp' | 'advisories' | 'library'>('nlp');
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [diseaseList, setDiseaseList] = useState<DiseaseKnowledgeItem[]>([]);
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(false);
  const [advisoryError, setAdvisoryError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  // Modal
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKnowledgeItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoadingAdvisories(true);
      setAdvisoryError(null);
      try {
        const [advData, disData] = await Promise.all([
          advisoryService.getAdvisories().catch((err) => {
            console.warn('Advisories load warning:', err);
            return [];
          }),
          advisoryService.getDiseaseLibrary().catch((err) => {
            console.warn('Disease library load warning:', err);
            return [];
          }),
        ]);
        if (isMounted) {
          setAdvisories(Array.isArray(advData) ? advData : []);
          setDiseaseList(Array.isArray(disData) ? disData : []);
        }
      } catch (err: any) {
        console.error('Advisory data fetch error:', err);
        if (isMounted) {
          setAdvisories([]);
          setDiseaseList([]);
          setAdvisoryError('Unable to load latest regional guidelines.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingAdvisories(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
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

  // Defensive array checks
  const safeAdvisories = Array.isArray(advisories) ? advisories : [];
  const safeDiseases = Array.isArray(diseaseList) ? diseaseList : [];

  const filteredAdvisories = safeAdvisories.filter((adv) => {
    if (!adv) return false;
    const matchesCategory = selectedCategory === 'ALL' || adv.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      (adv.title && adv.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (adv.crop && adv.crop.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (adv.shortSummary && adv.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const filteredDiseases = safeDiseases.filter((dis) => {
    if (!dis) return false;
    const matchesCrop = selectedCrop === 'ALL' || (dis.crop && dis.crop.toLowerCase() === selectedCrop.toLowerCase());
    const matchesQuery =
      searchQuery === '' ||
      (dis.diseaseName && dis.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dis.crop && dis.crop.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(dis.commonSymptoms) &&
        dis.commonSymptoms.some((s) => s && s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCrop && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agricultural Doctor & Crop Advisory"
        subtitle="Interact with the natural language AI assistant for real-time pathology diagnosis, chemical treatments, and regional seasonal guidelines"
        badge={
          <span className="rounded-full bg-agri-100 px-3 py-1 text-xs font-bold text-agri-800 border border-agri-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-agri-700" />
            <span>FastAPI /nlp/query Active</span>
          </span>
        }
      />

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 max-w-xl border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('nlp')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'nlp'
              ? 'bg-agri-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>AI Crop Doctor (NLP)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advisories')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'advisories'
              ? 'bg-white text-agri-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4 text-agri-700" />
          <span>Seasonal Advisories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'library'
              ? 'bg-white text-agri-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookCheck className="h-4 w-4 text-agri-700" />
          <span>Disease Library</span>
        </button>
      </div>

      {/* TAB 1: NLP AI CROP DOCTOR (Always Available) */}
      {activeTab === 'nlp' && <NLPQueryAssistant initialCrop={selectedCrop} />}

      {/* TAB 2: SEASONAL ADVISORIES */}
      {activeTab === 'advisories' && (
        <div className="space-y-4 animate-fade-in">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search advisories by crop or management practice..."
          />

          <FilterBar
            options={categoryOptions}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {isLoadingAdvisories ? (
            <LoadingState message="Loading agricultural advisories..." count={3} />
          ) : filteredAdvisories.length === 0 ? (
            <EmptyState
              title={advisoryError || "No advisories found"}
              description={advisoryError ? "Showing default offline agronomic recommendations." : "No agronomic guidelines match your search query."}
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

      {/* TAB 3: SEARCHABLE CROP DISEASE LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4 animate-fade-in">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search diseases by crop name, symptoms, or scientific pathogen..."
          />

          <FilterBar
            options={cropOptions}
            selectedId={selectedCrop}
            onSelect={setSelectedCrop}
          />

          {isLoadingAdvisories ? (
            <LoadingState message="Loading disease library..." count={3} />
          ) : filteredDiseases.length === 0 ? (
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
                        {dis.commonSymptoms && dis.commonSymptoms.slice(0, 2).map((s, idx) => (
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

export default AdvisoryPage;
