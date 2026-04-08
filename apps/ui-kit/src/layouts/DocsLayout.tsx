import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router';
import { componentRoutes } from '@/routes';
import styles from './DocsLayout.module.css';

export function DocsLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>UI Kit</h1>
        <nav className={styles.nav}>
          {componentRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={`/components/${route.path}`}
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
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
