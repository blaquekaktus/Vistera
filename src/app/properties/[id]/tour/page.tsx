'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { VRTourViewer } from '@/components/vr/VRTourViewer';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { VRTour } from '@/lib/types';

interface Props {
  params: { id: string };
  searchParams: { room?: string };
}

export default function VRTourPage({ params, searchParams }: Props) {
  const { language, t } = useLanguage();
  const [activeTour, setActiveTour] = useState<VRTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const property = properties.find((p) => p.id === params.id);
  if (!property || property.vrTours.length === 0) return notFound();

  // Init active tour
  useEffect(() => {
    const initialTour = searchParams.room
      ? property.vrTours.find((t) => t.id === searchParams.room) ?? property.vrTours[0]
      : property.vrTours[0];
    setActiveTour(initialTour);
  }, [property, searchParams.room]);

  const currentIdx = activeTour ? property.vrTours.findIndex((t) => t.id === activeTour.id) : 0;

  const goNext = () => {
    const next = property.vrTours[(currentIdx + 1) % property.vrTours.length];
    setActiveTour(next);
    setIsLoading(true);
  };

  const goPrev = () => {
    const prev = property.vrTours[(currentIdx - 1 + property.vrTours.length) % property.vrTours.length];
    setActiveTour(prev);
    setIsLoading(true);
  };

  const title = language === 'de' ? property.titleDe : property.title;

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/10 z-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/properties/${property.id}`}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.tour.back}</span>
          </Link>
          <div className="w-px h-4 bg-white/20" />
          <div>
            <div className="text-white font-semibold text-sm line-clamp-1">{title}</div>
            {activeTour && (
              <div className="text-white/50 text-xs">
                {language === 'de' ? activeTour.roomNameDe : activeTour.roomName}
                {' · '}
                {currentIdx + 1} / {property.vrTours.length}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation arrows */}
          {property.vrTours.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors text-xs font-medium hidden sm:block"
          >
            {t.tour.rooms}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main VR viewer */}
        <div className="flex-1 relative">
          {activeTour && (
            <VRTourViewer
              key={activeTour.id}
              panoramaUrl={activeTour.panoramaUrl}
              roomName={language === 'de' ? activeTour.roomNameDe : activeTour.roomName}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          )}
        </div>

        {/* Sidebar: room selector */}
        {sidebarOpen && property.vrTours.length > 1 && (
          <div className="w-52 bg-black/80 backdrop-blur-sm border-l border-white/10 flex flex-col overflow-y-auto hidden sm:flex">
            <div className="p-3 border-b border-white/10">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                {t.tour.rooms}
              </h3>
            </div>
            <div className="flex flex-col gap-1 p-2">
              {property.vrTours.map((tour, idx) => {
                const roomName = language === 'de' ? tour.roomNameDe : tour.roomName;
                const isActive = activeTour?.id === tour.id;
                return (
                  <button
                    key={tour.id}
                    onClick={() => { setActiveTour(tour); setIsLoading(true); }}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-xl text-left transition-all',
                      isActive
                        ? 'bg-brand-600/80 text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <div className="relative w-12 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                      <Image
                        src={tour.thumbnailUrl}
                        alt={roomName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium line-clamp-1">{roomName}</div>
                      <div className="text-xs opacity-50">{idx + 1}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile room pills */}
      {property.vrTours.length > 1 && (
        <div className="sm:hidden flex gap-2 overflow-x-auto px-3 py-2 bg-black/80 border-t border-white/10">
          {property.vrTours.map((tour) => {
            const roomName = language === 'de' ? tour.roomNameDe : tour.roomName;
            const isActive = activeTour?.id === tour.id;
            return (
              <button
                key={tour.id}
                onClick={() => { setActiveTour(tour); setIsLoading(true); }}
                className={cn(
                  'flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all',
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'bg-white/10 text-white/70'
                )}
              >
                {roomName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
