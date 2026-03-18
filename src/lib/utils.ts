import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Property, Language } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: 'EUR' | 'CHF', language: Language): string {
  const locale = language === 'de' ? 'de-DE' : 'en-GB';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('de-DE')} m²`;
}

export function getPropertyTypeLabel(type: Property['type'], language: Language): string {
  const labels: Record<Property['type'], { de: string; en: string }> = {
    apartment: { de: 'Wohnung', en: 'Apartment' },
    house: { de: 'Haus', en: 'House' },
    villa: { de: 'Villa', en: 'Villa' },
    chalet: { de: 'Chalet', en: 'Chalet' },
    penthouse: { de: 'Penthouse', en: 'Penthouse' },
    commercial: { de: 'Gewerbe', en: 'Commercial' },
  };
  return labels[type][language];
}

export function getCountryFlag(country: 'AT' | 'DE' | 'CH'): string {
  const flags = { AT: '🇦🇹', DE: '🇩🇪', CH: '🇨🇭' };
  return flags[country];
}

export function getCountryName(country: 'AT' | 'DE' | 'CH', language: Language): string {
  const names: Record<'AT' | 'DE' | 'CH', { de: string; en: string }> = {
    AT: { de: 'Österreich', en: 'Austria' },
    DE: { de: 'Deutschland', en: 'Germany' },
    CH: { de: 'Schweiz', en: 'Switzerland' },
  };
  return names[country][language];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
