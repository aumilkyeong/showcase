import { Suspense } from 'react';
import { NavLink, Outlet, useParams, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { componentRoutes } from '@/routes';
import styles from './DocsLayout.module.css';

export function DocsLayout() {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const location = useLocation();

  function getLocaleTogglePath(targetLocale: string) {
    return location.pathname.replace(`/${locale}/`, `/${targetLocale}/`);
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>{t('siteTitle')}</h1>
        <div className={styles.localeSwitcher}>
          <Link
            to={getLocaleTogglePath('ko')}
            className={`${styles.localeLink} ${locale === 'ko' ? styles.localeLinkActive : ''}`}
          >
            KO
          </Link>
          <span className={styles.localeDivider}>|</span>
          <Link
            to={getLocaleTogglePath('en')}
            className={`${styles.localeLink} ${locale === 'en' ? styles.localeLinkActive : ''}`}
          >
            EN
          </Link>
        </div>
        <nav className={styles.nav}>
          {componentRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={`/${locale}/components/${route.path}`}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <Suspense fallback={<div>{t('loading')}</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
