import { createContext, useContext, type Dispatch, type RefObject } from 'react';

export interface ImageData {
  src: string;
  alt: string;
  srcSet?: string;
}

export interface CarouselState {
  currentIndex: number;
  isTransitioning: boolean;
  loadedIndices: Set<number>;
  intent: 'idle' | 'hover' | 'active';
}

export type CarouselAction =
  | { type: 'PREV_IMAGE' }
  | { type: 'NEXT_IMAGE' }
  | { type: 'SHOW_IMAGE'; index: number }
  | { type: 'IMAGE_LOADED'; index: number }
  | { type: 'SET_INTENT'; intent: 'idle' | 'hover' | 'active' }
  | { type: 'TRANSITION_END' };

export interface ImageCarouselContextValue {
  images: ImageData[];
  loop: boolean;
  transitionDuration: number;
  width: number;
  height: number;
  autoplay: boolean;
  delay: number;
  state: CarouselState;
  dispatch: Dispatch<CarouselAction>;
  viewportRef: RefObject<HTMLDivElement | null>;
}

export const ImageCarouselContext =
  createContext<ImageCarouselContextValue | null>(null);

export function useImageCarouselContext(): ImageCarouselContextValue {
  const context = useContext(ImageCarouselContext);
  if (!context) {
    throw new Error(
      'ImageCarousel compound components must be used within <ImageCarousel>',
    );
  }
  return context;
}
