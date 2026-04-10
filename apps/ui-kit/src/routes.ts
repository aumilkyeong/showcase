import { lazy } from 'react';

export interface RouteEntry {
  path: string;
  label: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export const componentRoutes: RouteEntry[] = [
  {
    path: 'autocomplete',
    label: 'Autocomplete',
    component: lazy(() => import('./pages/autocomplete/AutocompletePage')),
  },
];
