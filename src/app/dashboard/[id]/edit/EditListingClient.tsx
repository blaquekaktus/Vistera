'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { VrTourManager } from '@/components/dashboard/VrTourManager';
import type { VrTour } from '@/components/dashboard/VrTourManager';
import Link from 'next/link';
import { Mountain, ArrowLeft, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateListing } from '@/lib/actions/property';

const PROPERTY_TYPES = [
  { value: 'apartment', de: 'Wohnung', en: 'Apartment' },
  { value: 'house', de: 'Haus', en: 'House' },
  { value: 'villa', de: 'Villa', en: 'Villa' },
  { value: 'chalet', de: 'Chalet', en: 'Chalet' },
  { value: 'penthouse', de: 'Penthouse', en: 'Penthouse' },
  { value: 'commercial', de: 'Gewerbe', en: 'Commercial' },
];

const COUNTRIES = [
  { value: 'AT', de: 'Österreich', en: 'Austria' },
  { value: 'DE', de: 'Deutschland', en: 'Germany' },
  { value: 'CH', de: 'Schweiz', en: 'Switzerland' },
];

const ENERGY_CLASSES = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all bg-white';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';
const sectionCls = 'bg-white rounded-2xl border border-slate-100 p-6 mb-5';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: Record<string, any>;
  userId: string;
}

const initialState = { error: undefined, success: false };

export default function EditListingClient({ property, userId }: Props) {
  const { language } = useLanguage();
  const [state, formAction] = useFormState(updateListing, initialState);
  const [images, setImages] = useState<string[]>(property.images ?? []);
  const [imagesUploading, setImagesUploading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white z-40 hidden lg:flex flex-col">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg">Vistera</span>
        </Link>
        <div className="p-4 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'de' ? 'Zum Dashboard' : 'Back to Dashboard'}
          </Link>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 max-w-3xl">
        <div className="lg:hidden mb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'de' ? 'Inserat bearbeiten' : 'Edit Listing'}
            </h1>
            <p className="text-sm text-slate-500">
              {property.title_de ?? property.title}
            </p>
          </div>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {language === 'de' ? 'Inserat aktualisiert.' : 'Listing updated.'}
          </div>
        )}

        <form action={formAction} noValidate>
          <input type="hidden" name="property_id" value={property.id} />

          {/* ── Section 1: Type ────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '1. Art des Inserats' : '1. Listing Type'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{language === 'de' ? 'Objekttyp *' : 'Property type *'}</label>
                <select name="type" required defaultValue={property.type} className={inputCls}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{language === 'de' ? t.de : t.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Angebotsart *' : 'Listing type *'}</label>
                <select name="listing_type" required defaultValue={property.listing_type} className={inputCls}>
                  <option value="sale">{language === 'de' ? 'Verkauf' : 'For Sale'}</option>
                  <option value="rent">{language === 'de' ? 'Miete' : 'For Rent'}</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>{language === 'de' ? 'Status' : 'Status'}</label>
                <select name="status" defaultValue={property.status ?? 'active'} className={inputCls}>
                  <option value="active">{language === 'de' ? 'Aktiv' : 'Active'}</option>
                  <option value="reserved">{language === 'de' ? 'Reserviert' : 'Reserved'}</option>
                  <option value="sold">{language === 'de' ? 'Verkauft' : 'Sold'}</option>
                  <option value="rented">{language === 'de' ? 'Vermietet' : 'Rented'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 2: Titles & Description ──────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '2. Titel & Beschreibung' : '2. Title & Description'}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>{language === 'de' ? 'Titel (Deutsch) *' : 'Title (German) *'}</label>
                <input name="title_de" type="text" required defaultValue={property.title_de ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Titel (Englisch)' : 'Title (English)'}</label>
                <input name="title" type="text" defaultValue={property.title ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Beschreibung (Deutsch)' : 'Description (German)'}</label>
                <textarea name="description_de" rows={3} defaultValue={property.description_de ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Beschreibung (Englisch)' : 'Description (English)'}</label>
                <textarea name="description" rows={3} defaultValue={property.description ?? ''} className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Section 3: Location ──────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '3. Standort' : '3. Location'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{language === 'de' ? 'Land *' : 'Country *'}</label>
                <select name="country" required defaultValue={property.country} className={inputCls}>
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>{language === 'de' ? c.de : c.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Stadt *' : 'City *'}</label>
                <input name="city" type="text" required defaultValue={property.city ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Region / Bundesland' : 'Region / State'}</label>
                <input name="region" type="text" defaultValue={property.region ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'PLZ' : 'Postal Code'}</label>
                <input name="postal_code" type="text" defaultValue={property.postal_code ?? ''} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>{language === 'de' ? 'Straße & Hausnummer' : 'Street & Number'}</label>
                <input name="street" type="text" defaultValue={property.street ?? ''} className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Section 4: Pricing ───────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '4. Preis' : '4. Pricing'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>{language === 'de' ? 'Preis *' : 'Price *'}</label>
                <input name="price" type="number" min="0" step="1" required defaultValue={property.price ?? ''} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Währung' : 'Currency'}</label>
                <select name="currency" defaultValue={property.currency ?? 'EUR'} className={inputCls}>
                  <option value="EUR">EUR €</option>
                  <option value="CHF">CHF Fr.</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 5: Features ──────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '5. Objektdaten' : '5. Property Details'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {[
                { name: 'area', label: language === 'de' ? 'Wohnfläche m² *' : 'Living area m² *', required: true, val: property.area },
                { name: 'rooms', label: language === 'de' ? 'Zimmer' : 'Rooms', val: property.rooms },
                { name: 'bedrooms', label: language === 'de' ? 'Schlafzimmer' : 'Bedrooms', val: property.bedrooms },
                { name: 'bathrooms', label: language === 'de' ? 'Badezimmer' : 'Bathrooms', val: property.bathrooms },
                { name: 'year_built', label: language === 'de' ? 'Baujahr' : 'Year built', val: property.year_built },
                { name: 'floor', label: language === 'de' ? 'Etage' : 'Floor', val: property.floor },
                { name: 'total_floors', label: language === 'de' ? 'Stockwerke ges.' : 'Total floors', val: property.total_floors },
              ].map((f) => (
                <div key={f.name}>
                  <label className={labelCls}>{f.label}</label>
                  <input
                    name={f.name}
                    type="number"
                    min="0"
                    step="1"
                    required={f.required}
                    defaultValue={f.val ?? ''}
                    className={inputCls}
                  />
                </div>
              ))}
              <div>
                <label className={labelCls}>{language === 'de' ? 'Energieklasse' : 'Energy class'}</label>
                <select name="energy_class" defaultValue={property.energy_class ?? ''} className={inputCls}>
                  <option value="">—</option>
                  {ENERGY_CLASSES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'parking', de: 'Stellplatz', en: 'Parking', val: property.parking },
                { name: 'elevator', de: 'Aufzug', en: 'Elevator', val: property.elevator },
                { name: 'balcony', de: 'Balkon/Terrasse', en: 'Balcony/Terrace', val: property.balcony },
                { name: 'garden', de: 'Garten', en: 'Garden', val: property.garden },
                { name: 'cellar', de: 'Keller', en: 'Cellar', val: property.cellar },
              ].map((feat) => (
                <label key={feat.name} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name={feat.name}
                    defaultChecked={!!feat.val}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 accent-brand-600"
                  />
                  <span className="text-sm text-slate-700">{language === 'de' ? feat.de : feat.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Section 6: Images ────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '6. Bilder' : '6. Images'}
            </h2>
            <input type="hidden" name="images" value={images.join('\n')} />
            <ImageUpload
              bucket="property-images"
              folder={userId}
              value={images}
              onChange={setImages}
              onUploadingChange={setImagesUploading}
              maxFiles={12}
              label={language === 'de' ? 'Bilder hochladen (max. 12)' : 'Upload images (max. 12)'}
            />
          </div>

          {/* ── Section 7: Amenities ─────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-1">
              {language === 'de' ? '7. Ausstattung' : '7. Amenities'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'de' ? 'Ein Ausstattungsmerkmal pro Zeile' : 'One amenity per line'}
            </p>
            <textarea
              name="amenities"
              rows={4}
              defaultValue={(property.amenities ?? []).join('\n')}
              className={inputCls}
            />
          </div>

          {/* ── Section 8: VR Tours ─────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <h2 className="font-bold text-slate-900 mb-1">
              {language === 'de' ? '8. VR-Touren' : '8. VR Tours'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'de'
                ? 'Lade equirektangulare 360°-Panoramabilder hoch. Jedes Bild wird ein begehbarer Raum in der VR-Tour.'
                : 'Upload equirectangular 360° panoramas. Each image becomes a walkable room in the VR tour.'}
            </p>
            <VrTourManager
              propertyId={property.id as string}
              userId={userId}
              initialTours={((property.vr_tours as Record<string, unknown>[] | null) ?? []).map((t): VrTour => ({
                id:           t.id as string,
                panoramaUrl:  t.panorama_url as string,
                thumbnailUrl: (t.thumbnail_url as string | null) ?? null,
                roomName:     (t.room_name as string) || '',
                roomNameDe:   (t.room_name_de as string) || '',
                sortOrder:    (t.sort_order as number) ?? 0,
              }))}
            />
          </div>

          <div className="flex items-center gap-4">
            <SubmitButton
              className="flex-1 sm:flex-none sm:w-auto bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              pendingText={language === 'de' ? 'Wird gespeichert...' : 'Saving...'}
              disabled={imagesUploading}
            >
              {imagesUploading
                ? (language === 'de' ? 'Bilder werden hochgeladen…' : 'Uploading images…')
                : (language === 'de' ? 'Änderungen speichern' : 'Save Changes')}
            </SubmitButton>
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
