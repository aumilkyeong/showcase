import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { LocaleLayout } from '@/layouts/LocaleLayout';
import { DocsLayout } from '@/layouts/DocsLayout';
import { componentRoutes } from '@/routes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ko/components/autocomplete" replace />} />
        <Route path="/:locale/components" element={<LocaleLayout />}>
          <Route element={<DocsLayout />}>
            {componentRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
