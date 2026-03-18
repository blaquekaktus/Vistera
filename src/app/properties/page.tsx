'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/lib/data';
import type { SearchFilters } from '@/lib/types';
import { Building2 } from 'lucide-react';

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

export default function PropertiesPage() {
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const title = language === 'de' ? p.titleDe : p.title;
      const query = filters.query.toLowerCase();

      if (query && !title.toLowerCase().includes(query) &&
          !p.address.city.toLowerCase().includes(query) &&
          !p.address.region.toLowerCase().includes(query)) {
        return false;
      }
      if (filters.type && p.type !== filters.type) return false;
      if (filters.listingType && p.listingType !== filters.listingType) return false;
      if (filters.country && p.address.country !== filters.country) return false;
      if (filters.minPrice !== '' && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== '' && p.price > filters.maxPrice) return false;
      if (filters.minArea !== '' && p.features.area < filters.minArea) return false;
      if (filters.hasVrTour && p.vrTours.length === 0) return false;

      return true;
    });
  }, [filters, language]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        {/* Page header */}
        <div className="bg-gradient-to-br from-brand-950 to-brand-900 pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white">
                {t.nav.properties}
              </h1>
            </div>
            <p className="text-white/60 text-sm">
              {language === 'de'
                ? 'Finden Sie Ihre Traumimmobilie im DACH-Raum mit VR-Tour'
                : 'Find your dream property in the DACH region with VR tour'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-6">
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredProperties.length}
            />
          </div>

          {/* Results */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg font-medium mb-2">
                {language === 'de' ? 'Keine Ergebnisse' : 'No results'}
              </p>
              <p className="text-slate-400 text-sm">{t.search.noResults}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
