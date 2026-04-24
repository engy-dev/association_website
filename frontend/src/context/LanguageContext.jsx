// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const translations = { fr, en, ar };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('lang') || 'fr'  // default to French
  );

  useEffect(() => {
    localStorage.setItem('lang', language);
    // Handle RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // t('hero.title') → looks up nested keys
  const t = (key) => {
    return key.split('.').reduce(
      (obj, k) => obj?.[k],
      translations[language]
    ) ?? key; // fallback to the key itself if missing
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);