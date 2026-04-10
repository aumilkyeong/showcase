import { useEffect } from 'react';
import { useParams, Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LOCALES = ['ko', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function LocaleLayout() {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && isSupportedLocale(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  if (!locale || !isSupportedLocale(locale)) {
    return <Navigate to="/ko/components/autocomplete" replace />;
  }

  return <Outlet />;
}
