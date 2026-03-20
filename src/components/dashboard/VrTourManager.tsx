'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { Eye, Trash2, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { addVrTour, deleteVrTour } from '@/lib/actions/vr';

export interface VrTour {
  id: string;
  panoramaUrl: string;
  thumbnailUrl: string | null;
  roomName: string;
  roomNameDe: string;
  sortOrder: number;
}

const inputCls =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all bg-white';

// ── Single-tour delete row ───────────────────────────────────────────────────

function TourRow({
  tour,
  propertyId,
  language,
}: {
  tour: VrTour;
  propertyId: string;
  language: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    const fd = new FormData();
    fd.append('tour_id', tour.id);
    fd.append('property_id', propertyId);
    startTransition(async () => {
      const result = await deleteVrTour({}, fd);
      if (result.error) setError(result.error);
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      {/* Thumbnail */}
      <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
        <Image
          src={tour.thumbnailUrl ?? tour.panoramaUrl}
          alt={language === 'de' ? tour.roomNameDe : tour.roomName}
          fill
          className="object-cover"
          unoptimized
        />
        {/* 360° badge */}
        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" />
          360°
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 truncate">
          {language === 'de' ? tour.roomNameDe : tour.roomName}
        </div>
        {tour.roomName !== tour.roomNameDe && (
          <div className="text-xs text-slate-400 truncate">
            {language === 'de' ? tour.roomName : tour.roomNameDe}
          </div>
        )}
      </div>

      {/* Error feedback */}
      {error && (
        <span className="text-xs text-red-600 flex-shrink-0">{error}</span>
      )}

      {/* Delete — plain button to avoid nested-form issue (this component lives
          inside the parent edit <form>, so a child <form> would be ignored by
          the browser). useTransition calls the server action directly instead. */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
        title={language === 'de' ? 'Raum löschen' : 'Delete room'}
      >
        {isPending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Trash2 className="w-4 h-4" />
        }
      </button>
    </div>
  );
}

// ── Add-tour form ────────────────────────────────────────────────────────────

function AddTourForm({
  propertyId,
  userId,
  language,
}: {
  propertyId: string;
  userId: string;
  language: string;
}) {
  const [addState, formAction] = useFormState(addVrTour, {});
  const [panorama, setPanorama] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear panorama and reset inputs after successful add
  useEffect(() => {
    if (addState.success) {
      setPanorama([]);
      formRef.current?.reset();
    }
  }, [addState.success]);

  return (
    <div className="mt-4 border-2 border-dashed border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Plus className="w-4 h-4 text-brand-600" />
        <span className="text-sm font-semibold text-slate-700">
          {language === 'de' ? 'Panorama hinzufügen' : 'Add panorama'}
        </span>
      </div>

      {addState.success && (
        <div className="flex items-center gap-2 text-green-700 text-xs font-medium mb-3">
          <CheckCircle className="w-3.5 h-3.5" />
          {language === 'de' ? 'VR-Raum hinzugefügt.' : 'VR room added.'}
        </div>
      )}

      {addState.error && (
        <div className="flex items-center gap-2 text-red-600 text-xs mb-3">
          <AlertCircle className="w-3.5 h-3.5" />
          {addState.error}
        </div>
      )}

      {/* Step 1: upload panorama */}
      <ImageUpload
        bucket="panoramas"
        folder={userId}
        value={panorama}
        onChange={setPanorama}
        maxFiles={1}
        accept="image/jpeg,image/png,image/webp"
        label={
          language === 'de'
            ? 'Equirektangulares Panoramabild (JPEG/PNG/WebP, max. 50 MB)'
            : 'Equirectangular panorama image (JPEG/PNG/WebP, max. 50 MB)'
        }
      />

      {/* Step 2: name + submit (shown once image is uploaded) */}
      {panorama.length > 0 && (
        <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="property_id"  value={propertyId} />
          <input type="hidden" name="panorama_url" value={panorama[0]} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {language === 'de' ? 'Zimmerbezeichnung (Deutsch) *' : 'Room name (German) *'}
              </label>
              <input
                name="room_name_de"
                type="text"
                required
                placeholder={language === 'de' ? 'z.B. Wohnzimmer' : 'e.g. Wohnzimmer'}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {language === 'de' ? 'Zimmerbezeichnung (Englisch)' : 'Room name (English)'}
              </label>
              <input
                name="room_name"
                type="text"
                placeholder={language === 'de' ? 'z.B. Living Room' : 'e.g. Living Room'}
                className={inputCls}
              />
            </div>
          </div>

          <SubmitButton
            className="self-start bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center gap-2"
            pendingText={language === 'de' ? 'Wird gespeichert…' : 'Saving…'}
          >
            <Plus className="w-4 h-4" />
            {language === 'de' ? 'Raum hinzufügen' : 'Add room'}
          </SubmitButton>
        </form>
      )}

      {panorama.length === 0 && (
        <p className="text-xs text-slate-400 mt-2">
          {language === 'de'
            ? 'Lade zunächst ein Panoramabild hoch, dann kannst du die Raumbezeichnung eingeben.'
            : 'First upload a panorama image, then enter the room name.'}
        </p>
      )}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

interface Props {
  propertyId: string;
  userId: string;
  initialTours: VrTour[];
}

export function VrTourManager({ propertyId, userId, initialTours }: Props) {
  const { language } = useLanguage();

  return (
    <div>
      {/* Existing tours */}
      {initialTours.length === 0 ? (
        <p className="text-sm text-slate-400 mb-2">
          {language === 'de'
            ? 'Noch keine VR-Räume hinzugefügt.'
            : 'No VR rooms added yet.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-2">
          {initialTours.map((tour) => (
            <TourRow
              key={tour.id}
              tour={tour}
              propertyId={propertyId}
              language={language}
            />
          ))}
        </div>
      )}

      <AddTourForm propertyId={propertyId} userId={userId} language={language} />
    </div>
  );
}
