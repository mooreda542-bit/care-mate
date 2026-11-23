/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import en from '../locales/en';
import ar from '../locales/ar';

const LanguageContext = createContext(null);

const translations = { en, ar };

export function LanguageProvider({ children }) {
  // Arabic is the approved default language for CareMate
  const [language, setLanguageState] = useState(() => {
    const saved = getStorageItem('caremate_language', null);
    return saved === 'ar' || saved === 'en' ? saved : 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    setStorageItem('caremate_language', language);
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'ar') {
      setLanguageState(newLang);
    }
  };

  /**
   * Safe key resolver supporting dot notation (e.g. t('nav.home'))
   */
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL: direction === 'rtl',
        toggleLanguage,
        setLanguage,
        t,
        messages: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
