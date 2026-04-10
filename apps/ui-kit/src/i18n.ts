import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import koCommon from '@/locales/ko/common.json';
import koAutocomplete from '@/locales/ko/autocomplete.json';
import koDropdownMenu from '@/locales/ko/dropdown-menu.json';
import koImageCarousel from '@/locales/ko/image-carousel.json';
import enCommon from '@/locales/en/common.json';
import enAutocomplete from '@/locales/en/autocomplete.json';
import enDropdownMenu from '@/locales/en/dropdown-menu.json';
import enImageCarousel from '@/locales/en/image-carousel.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      common: koCommon,
      autocomplete: koAutocomplete,
      'dropdown-menu': koDropdownMenu,
      'image-carousel': koImageCarousel,
    },
    en: {
      common: enCommon,
      autocomplete: enAutocomplete,
      'dropdown-menu': enDropdownMenu,
      'image-carousel': enImageCarousel,
    },
  },
  lng: 'ko',
  fallbackLng: 'ko',
  ns: ['common', 'autocomplete', 'dropdown-menu', 'image-carousel'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
