'use client';

import { useFormState } from 'react-dom';
import { SubmitButton } from '@/components/ui/SubmitButton';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Zap, CheckCircle2, AlertCircle,
  Play, Phone, Mail, Star, ChevronRight, Layers,
  ParkingSquare, TreePine, Warehouse, ArrowUpDown,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, getCountryFlag, getCountryName, cn } from '@/lib/utils';
import { useState } from 'react';
import { submitInquiry } from '@/lib/actions/property';
import type { Property } from '@/lib/types';

const inquiryInitialState = { error: undefined, success: false };

interface Props {
  property: Property;
}

export default function PropertyDetailClient({ property }: Props) {
  const { language, t } = useLanguage();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [inquiryState, inquiryAction] = useFormState(submitInquiry, inquiryInitialState);

  const title = language === 'de' ? property.titleDe : property.title;
  const description = language === 'de' ? property.descriptionDe : property.description;
  const flag = getCountryFlag(property.address.country);
  const countryName = getCountryName(property.address.country, language);
  const formattedPrice = formatPrice(property.price, property.currency, language);

  const typeLabel: Record<typeof property.type, { de: string; en: string }> = {
    apartment: { de: 'Wohnung', en: 'Apartment' },
    house: { de: 'Haus', en: 'House' },
    villa: { de: 'Villa', en: 'Villa' },
    chalet: { de: 'Chalet', en: 'Chalet' },
    penthouse: { de: 'Penthouse', en: 'Penthouse' },
    commercial: { de: 'Gewerbe', en: 'Commercial' },
  };

  const energyColors: Record<string, string> = {
    'A+': 'bg-green-500', A: 'bg-green-400', B: 'bg-lime-400',
    C: 'bg-yellow-400', D: 'bg-orange-400', E: 'bg-red-400',
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/properties" className="flex items-center gap-1.5 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.nav.properties}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium line-clamp-1">{title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Images + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-200 aspect-[16/9]">
                {property.images.length > 0 && (
                  <Image
                    src={property.images[activeImageIdx]}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {/* Type badge */}
                <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {typeLabel[property.type][language]}
                </div>
                {/* VR tour button */}
                {property.vrTours.length > 0 && (
                  <Link
                    href={`/properties/${property.id}/tour`}
                    className="absolute bottom-4 right-4 flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg hover:bg-brand-700 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {t.properties.vrTour}
                  </Link>
                )}
              </div>

              {/* Thumbnail strip */}
              {property.images.length > 1 && (
                <div className="flex gap-3">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        'relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                        activeImageIdx === idx ? 'border-brand-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
                      )}
                    >
                      <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Price */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <span>{flag}</span>
                      <MapPin className="w-4 h-4" />
                      <span>{property.address.street}, {property.address.city}, {countryName}</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-brand-700">{formattedPrice}</div>
                    {property.listingType === 'rent' && (
                      <div className="text-sm text-slate-500">{t.properties.perMonth}</div>
                    )}
                    {property.pricePerSqm && (
                      <div className="text-sm text-slate-400">
                        {formatPrice(property.pricePerSqm, property.currency, language)} / m²
                      </div>
                    )}
                  </div>
                </div>

                {/* Key specs */}
                <div className="grid grid-cols-4 gap-4 py-4 border-y border-slate-100">
                  {[
                    { icon: Layers, label: property.features.rooms, sub: language === 'de' ? 'Zimmer' : 'Rooms' },
                    { icon: Bed, label: property.features.bedrooms, sub: language === 'de' ? 'Schlafzimmer' : 'Bedrooms' },
                    { icon: Bath, label: property.features.bathrooms, sub: language === 'de' ? 'Bäder' : 'Bathrooms' },
                    { icon: Square, label: `${property.features.area} m²`, sub: language === 'de' ? 'Wohnfläche' : 'Living Area' },
                  ].map((spec) => (
                    <div key={spec.sub} className="text-center">
                      <spec.icon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="font-bold text-slate-900">{spec.label}</div>
                      <div className="text-xs text-slate-500">{spec.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mt-4 text-sm">{description}</p>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {language === 'de' ? 'Objektdetails' : 'Property Details'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {[
                    {
                      label: language === 'de' ? 'Baujahr' : 'Year Built',
                      value: property.features.yearBuilt,
                      icon: Calendar,
                    },
                    {
                      label: language === 'de' ? 'Etage' : 'Floor',
                      value: property.features.floor !== undefined
                        ? `${property.features.floor}/${property.features.totalFloors}`
                        : '—',
                      icon: Layers,
                    },
                    {
                      label: language === 'de' ? 'Energieklasse' : 'Energy Class',
                      value: property.features.energyClass,
                      icon: Zap,
                    },
                    {
                      label: language === 'de' ? 'Grundstück' : 'Plot',
                      value: property.features.plotArea ? `${property.features.plotArea} m²` : '—',
                      icon: TreePine,
                    },
                    {
                      label: language === 'de' ? 'Stellplatz' : 'Parking',
                      value: property.features.parking ? '✓' : '✗',
                      icon: ParkingSquare,
                    },
                    {
                      label: language === 'de' ? 'Aufzug' : 'Elevator',
                      value: property.features.elevator ? '✓' : '✗',
                      icon: ArrowUpDown,
                    },
                    {
                      label: language === 'de' ? 'Keller' : 'Cellar',
                      value: property.features.cellar ? '✓' : '✗',
                      icon: Warehouse,
                    },
                    {
                      label: language === 'de' ? 'Balkon' : 'Balcony',
                      value: property.features.balcony ? '✓' : '✗',
                      icon: TreePine,
                    },
                  ].filter((d) => d.value !== undefined).map((detail) => (
                    <div key={detail.label} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                      <detail.icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-slate-500">{detail.label}</div>
                        <div className={cn(
                          'font-semibold text-slate-900 mt-0.5',
                          detail.label.includes('Energie') || detail.label.includes('Energy')
                            ? `inline-block text-white px-2 py-0.5 rounded text-xs ${energyColors[detail.value as string] ?? 'bg-slate-400'}`
                            : ''
                        )}>
                          {detail.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    {language === 'de' ? 'Ausstattung' : 'Amenities'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-100">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* VR Tours */}
              {property.vrTours.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      {language === 'de' ? 'VR-Touren' : 'VR Tours'}
                    </h2>
                    <Link
                      href={`/properties/${property.id}/tour`}
                      className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {language === 'de' ? 'Alle starten' : 'Start All'}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.vrTours.map((tour) => {
                      const roomName = language === 'de' ? tour.roomNameDe : tour.roomName;
                      return (
                        <Link
                          key={tour.id}
                          href={`/properties/${property.id}/tour?room=${tour.id}`}
                          className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-brand-300 transition-all"
                        >
                          <Image
                            src={tour.thumbnailUrl}
                            alt={roomName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <span className="text-white text-xs font-medium">{roomName}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Agent card + Contact */}
            <div className="space-y-4">
              {/* Agent card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
                <div className="flex items-center gap-4 mb-5">
                  {property.agent.avatar ? (
                    <Image
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-2 border-brand-100"
                    />
                  ) : (
                    <div className="w-15 h-15 rounded-full bg-brand-100 flex items-center justify-center border-2 border-brand-100">
                      <span className="text-lg font-bold text-brand-600">
                        {property.agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{property.agent.name}</div>
                    <div className="text-xs text-slate-500">{property.agent.agency}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-gold-400 fill-current" />
                      <span className="text-sm font-semibold text-slate-700">{property.agent.rating}</span>
                      <span className="text-xs text-slate-400">({property.agent.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 mb-4 flex flex-wrap gap-1">
                  {property.agent.languages.map((lang) => (
                    <span key={lang} className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {property.agent.phone && (
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      {property.agent.phone}
                    </a>
                  )}
                  {property.agent.email && (
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      {language === 'de' ? 'E-Mail senden' : 'Send Email'}
                    </a>
                  )}
                </div>

                {/* Contact form */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    {language === 'de' ? 'Nachricht senden' : 'Send Message'}
                  </h3>

                  {inquiryState.success ? (
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{language === 'de' ? 'Anfrage gesendet!' : 'Inquiry sent!'}</p>
                        <p className="text-green-600 text-xs mt-0.5">
                          {language === 'de'
                            ? 'Der Makler meldet sich in Kürze bei Ihnen.'
                            : 'The agent will get back to you shortly.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form action={inquiryAction} className="flex flex-col gap-2">
                      <input type="hidden" name="propertyId" value={property.id} />
                      <input type="hidden" name="agentId" value={property.agent.id} />

                      {inquiryState.error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {inquiryState.error}
                        </div>
                      )}

                      <input
                        name="name"
                        type="text"
                        required
                        placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder={language === 'de' ? 'E-Mail-Adresse' : 'Email address'}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                      />
                      <textarea
                        name="message"
                        rows={3}
                        required
                        placeholder={language === 'de'
                          ? 'Ich interessiere mich für dieses Objekt...'
                          : 'I am interested in this property...'}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none"
                      />
                      <SubmitButton
                        className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        pendingText={language === 'de' ? 'Wird gesendet...' : 'Sending...'}
                      >
                        {language === 'de' ? 'Anfrage senden' : 'Send Inquiry'}
                      </SubmitButton>
                    </form>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{property.views.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{language === 'de' ? 'Aufrufe' : 'Views'}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-600">{property.vrViews.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">VR-{language === 'de' ? 'Aufrufe' : 'Views'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
