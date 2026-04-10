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
  {
    path: 'dropdown-menu',
    label: 'Dropdown Menu',
    component: lazy(() => import('./pages/dropdown-menu/DropdownMenuPage')),
  },
  {
    path: 'image-carousel',
    label: 'Image Carousel',
    component: lazy(() => import('./pages/image-carousel/ImageCarouselPage')),
  },
  {
    path: 'modal-dialog',
    label: 'Modal Dialog',
    component: lazy(() => import('./pages/modal-dialog/ModalDialogPage')),
  },
];
