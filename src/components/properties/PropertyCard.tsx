'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Square, MapPin, Play, Eye, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, getCountryFlag, cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'compact';
}

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const { language, t } = useLanguage();

  const title = language === 'de' ? property.titleDe : property.title;
  const formattedPrice = formatPrice(property.price, property.currency, language);
  const hasVrTour = property.vrTours.length > 0;
  const flag = getCountryFlag(property.address.country);

  const statusColors: Record<Property['status'], string> = {
    active: 'bg-green-500',
    reserved: 'bg-amber-500',
    sold: 'bg-red-500',
    rented: 'bg-slate-500',
  };

  const statusLabels: Record<Property['status'], { de: string; en: string }> = {
    active: { de: 'Aktiv', en: 'Active' },
    reserved: { de: 'Reserviert', en: 'Reserved' },
    sold: { de: 'Verkauft', en: 'Sold' },
    rented: { de: 'Vermietet', en: 'Rented' },
  };

  return (
    <div className={cn(
      'property-card bg-white rounded-2xl overflow-hidden border border-slate-100 group',
      variant === 'compact' ? 'flex' : ''
    )}>
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden bg-slate-100',
        variant === 'compact' ? 'w-48 flex-shrink-0' : 'h-52'
      )}>
        <Image
          src={property.images[0]}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.featured && (
            <span className="flex items-center gap-1 bg-gold-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              <Star className="w-3 h-3" />
              {t.properties.featured}
            </span>
          )}
          <span className={cn(
            'text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm',
            property.listingType === 'sale' ? 'bg-brand-600' : 'bg-alpine-600'
          )}>
            {property.listingType === 'sale' ? t.properties.sale : t.properties.rent}
          </span>
        </div>

        {/* Status */}
        {property.status !== 'active' && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              'text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm',
              statusColors[property.status]
            )}>
              {statusLabels[property.status][language]}
            </span>
          </div>
        )}

        {/* VR Tour button overlay */}
        {hasVrTour && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <Link
              href={`/properties/${property.id}/tour`}
              className="flex items-center gap-2 bg-white/95 text-brand-700 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-4 h-4 fill-current" />
              {t.properties.vrTour}
            </Link>
          </div>
        )}

        {/* VR indicator */}
        {hasVrTour && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-brand-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            VR
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <span>{flag}</span>
          <MapPin className="w-3 h-3" />
          <span>{property.address.city}, {property.address.region}</span>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-slate-900 mb-1 hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-lg font-bold text-brand-700">{formattedPrice}</span>
          {property.listingType === 'rent' && (
            <span className="text-sm text-slate-500">{t.properties.perMonth}</span>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{property.features.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.features.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4 text-slate-400" />
            <span>{property.features.area} m²</span>
          </div>
          {property.features.energyClass && (
            <span className="ml-auto bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded border border-green-100">
              {property.features.energyClass}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Image
              src={property.agent.avatar}
              alt={property.agent.name}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="text-xs text-slate-500 line-clamp-1">{property.agent.name}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.vrViews.toLocaleString()} VR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
