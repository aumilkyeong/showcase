import '@testing-library/jest-dom/vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import enAutocomplete from '@/locales/en/autocomplete.json';
import koCommon from '@/locales/ko/common.json';
import koAutocomplete from '@/locales/ko/autocomplete.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, autocomplete: enAutocomplete },
    ko: { common: koCommon, autocomplete: koAutocomplete },
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'autocomplete'],
  defaultNs: 'common',
  interpolation: { escapeValue: false },
});

beforeEach(async () => {
  await i18n.changeLanguage('en');
});
