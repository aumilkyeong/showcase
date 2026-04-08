import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { DocsLayout } from '@/layouts/DocsLayout';
import { componentRoutes } from '@/routes';

function HomePage() {
  return <Navigate to={`/components/${componentRoutes[0].path}`} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/components" element={<DocsLayout />}>
          {componentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
