'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Language } from '@/lib/types';
import { translations } from '@/lib/translations';

type AnyTranslation = typeof translations['de'] | typeof translations['en'];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: AnyTranslation;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
