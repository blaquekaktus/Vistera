'use client';

import { useFormState } from 'react-dom';
import { SubmitButton } from '@/components/ui/SubmitButton';
import Link from 'next/link';
import { Mountain, ArrowLeft, AlertCircle, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { createListing } from '@/lib/actions/property';

const initialState = { error: undefined, success: false };

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

export default function NewListingPage() {
  const { language } = useLanguage();
  const [state, formAction] = useFormState(createListing, initialState);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard-style header */}
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
        {/* Mobile back */}
        <div className="lg:hidden mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'de' ? 'Dashboard' : 'Dashboard'}
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {language === 'de' ? 'Neues Inserat' : 'New Listing'}
            </h1>
            <p className="text-sm text-slate-500">
              {language === 'de' ? 'Immobilie erfassen und veröffentlichen' : 'Add and publish a property'}
            </p>
          </div>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
          </div>
        )}

        <form action={formAction}>
          {/* ── Section 1: Type ────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-4">
              {language === 'de' ? '1. Art des Inserats' : '1. Listing Type'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{language === 'de' ? 'Objekttyp *' : 'Property type *'}</label>
                <select name="type" required className={inputCls}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{language === 'de' ? t.de : t.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Angebotsart *' : 'Listing type *'}</label>
                <select name="listing_type" required className={inputCls}>
                  <option value="sale">{language === 'de' ? 'Verkauf' : 'For Sale'}</option>
                  <option value="rent">{language === 'de' ? 'Miete' : 'For Rent'}</option>
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
                <input name="title_de" type="text" required placeholder="z.B. Luxuswohnung in Innsbruck" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Titel (Englisch)' : 'Title (English)'}</label>
                <input name="title" type="text" placeholder="e.g. Luxury apartment in Innsbruck" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Beschreibung (Deutsch)' : 'Description (German)'}</label>
                <textarea name="description_de" rows={3} className={inputCls} placeholder="Objektbeschreibung auf Deutsch..." />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Beschreibung (Englisch)' : 'Description (English)'}</label>
                <textarea name="description" rows={3} className={inputCls} placeholder="Property description in English..." />
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
                <select name="country" required className={inputCls}>
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>{language === 'de' ? c.de : c.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Stadt *' : 'City *'}</label>
                <input name="city" type="text" required placeholder="Innsbruck" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Region / Bundesland' : 'Region / State'}</label>
                <input name="region" type="text" placeholder="Tirol" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'PLZ' : 'Postal Code'}</label>
                <input name="postal_code" type="text" placeholder="6020" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>{language === 'de' ? 'Straße & Hausnummer' : 'Street & Number'}</label>
                <input name="street" type="text" placeholder="Innstraße 45" className={inputCls} />
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
                <label className={labelCls}>
                  {language === 'de' ? 'Preis *' : 'Price *'}
                  <span className="text-slate-400 font-normal ml-1">
                    ({language === 'de' ? 'Kauf: gesamt, Miete: monatlich' : 'Sale: total, Rent: monthly'})
                  </span>
                </label>
                <input name="price" type="number" min="0" step="1" required placeholder="850000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{language === 'de' ? 'Währung' : 'Currency'}</label>
                <select name="currency" className={inputCls}>
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
                { name: 'area', label: language === 'de' ? 'Wohnfläche m² *' : 'Living area m² *', required: true, placeholder: '120' },
                { name: 'rooms', label: language === 'de' ? 'Zimmer' : 'Rooms', placeholder: '4' },
                { name: 'bedrooms', label: language === 'de' ? 'Schlafzimmer' : 'Bedrooms', placeholder: '2' },
                { name: 'bathrooms', label: language === 'de' ? 'Badezimmer' : 'Bathrooms', placeholder: '1' },
                { name: 'year_built', label: language === 'de' ? 'Baujahr' : 'Year built', placeholder: '2020' },
                { name: 'floor', label: language === 'de' ? 'Etage' : 'Floor', placeholder: '3' },
                { name: 'total_floors', label: language === 'de' ? 'Stockwerke ges.' : 'Total floors', placeholder: '5' },
              ].map((f) => (
                <div key={f.name}>
                  <label className={labelCls}>{f.label}</label>
                  <input
                    name={f.name}
                    type="number"
                    min="0"
                    step="1"
                    required={f.required}
                    placeholder={f.placeholder}
                    className={inputCls}
                  />
                </div>
              ))}
              <div>
                <label className={labelCls}>{language === 'de' ? 'Energieklasse' : 'Energy class'}</label>
                <select name="energy_class" className={inputCls}>
                  <option value="">—</option>
                  {ENERGY_CLASSES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            {/* Boolean features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'parking', de: 'Stellplatz', en: 'Parking' },
                { name: 'elevator', de: 'Aufzug', en: 'Elevator' },
                { name: 'balcony', de: 'Balkon/Terrasse', en: 'Balcony/Terrace' },
                { name: 'garden', de: 'Garten', en: 'Garden' },
                { name: 'cellar', de: 'Keller', en: 'Cellar' },
              ].map((feat) => (
                <label key={feat.name} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" name={feat.name} className="w-4 h-4 rounded border-slate-300 text-brand-600 accent-brand-600" />
                  <span className="text-sm text-slate-700">{language === 'de' ? feat.de : feat.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Section 6: Images ────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-1">
              {language === 'de' ? '6. Bilder' : '6. Images'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'de'
                ? 'Bild-URLs eingeben, eine pro Zeile (z.B. von Unsplash)'
                : 'Enter image URLs, one per line (e.g. from Unsplash)'}
            </p>
            <textarea
              name="images"
              rows={4}
              className={inputCls}
              placeholder="https://images.unsplash.com/photo-...&#10;https://images.unsplash.com/photo-..."
            />
          </div>

          {/* ── Section 7: Amenities ─────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="font-bold text-slate-900 mb-1">
              {language === 'de' ? '7. Ausstattung' : '7. Amenities'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'de'
                ? 'Ein Ausstattungsmerkmal pro Zeile'
                : 'One amenity per line'}
            </p>
            <textarea
              name="amenities"
              rows={4}
              className={inputCls}
              placeholder={language === 'de'
                ? 'Concierge\nTiefgarage\nSauna\nFitnessraum'
                : 'Concierge\nUnderground garage\nSauna\nGym'}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <SubmitButton
              className="flex-1 sm:flex-none sm:w-auto bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              pendingText={language === 'de' ? 'Wird veröffentlicht...' : 'Publishing...'}
            >
              {language === 'de' ? 'Inserat veröffentlichen' : 'Publish Listing'}
            </SubmitButton>
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
