'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { SearchFilters } from '@/lib/types';

interface PropertyFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount: number;
}

const defaultFilters: SearchFilters = {
  query: '',
  type: '',
  listingType: '',
  country: '',
  region: '',
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  minRooms: '',
  hasVrTour: false,
};

export function PropertyFilters({ filters, onFiltersChange, resultCount }: PropertyFiltersProps) {
  const { language, t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => onFiltersChange(defaultFilters);

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (key === 'query') return false;
    return val !== '' && val !== false;
  });

  const propertyTypes = [
    { value: '', label: language === 'de' ? 'Alle Typen' : 'All Types' },
    { value: 'apartment', label: language === 'de' ? 'Wohnung' : 'Apartment' },
    { value: 'house', label: language === 'de' ? 'Haus' : 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'chalet', label: 'Chalet' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'commercial', label: language === 'de' ? 'Gewerbe' : 'Commercial' },
  ];

  const listingTypes = [
    { value: '', label: language === 'de' ? 'Kauf & Miete' : 'Buy & Rent' },
    { value: 'sale', label: language === 'de' ? 'Kaufen' : 'Buy' },
    { value: 'rent', label: language === 'de' ? 'Mieten' : 'Rent' },
  ];

  const countries = [
    { value: '', label: 'AT, DE, CH' },
    { value: 'AT', label: '🇦🇹 Österreich' },
    { value: 'DE', label: '🇩🇪 Deutschland' },
    { value: 'CH', label: '🇨🇭 Schweiz' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      {/* Search row */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.search.placeholder}
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all',
            showAdvanced
              ? 'bg-brand-600 text-white border-brand-600'
              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.search.filters}
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Quick filters row */}
      <div className="flex flex-wrap gap-2 mt-3">
        {listingTypes.map((lt) => (
          <button
            key={lt.value}
            onClick={() => updateFilter('listingType', lt.value as SearchFilters['listingType'])}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              filters.listingType === lt.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {lt.label}
          </button>
        ))}
        <div className="w-px bg-slate-200 self-stretch mx-1" />
        {countries.map((c) => (
          <button
            key={c.value}
            onClick={() => updateFilter('country', c.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              filters.country === c.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {c.label}
          </button>
        ))}
        <div className="w-px bg-slate-200 self-stretch mx-1" />
        <button
          onClick={() => updateFilter('hasVrTour', !filters.hasVrTour)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
            filters.hasVrTour
              ? 'bg-brand-600 text-white border-brand-600'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'
          )}
        >
          <Headphones className="w-3.5 h-3.5" />
          VR
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                {language === 'de' ? 'Typ' : 'Type'}
              </label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value as SearchFilters['type'])}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              >
                {propertyTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                {language === 'de' ? 'Min. Preis' : 'Min. Price'}
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                {language === 'de' ? 'Max. Preis' : 'Max. Price'}
              </label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                {language === 'de' ? 'Min. m²' : 'Min. m²'}
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minArea}
                onChange={(e) => updateFilter('minArea', e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 mt-3 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {language === 'de' ? 'Filter zurücksetzen' : 'Reset filters'}
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mt-3 text-xs text-slate-400">
        {resultCount} {t.search.results}
      </div>
    </div>
  );
}
