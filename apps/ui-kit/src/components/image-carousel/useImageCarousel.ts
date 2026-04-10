import { useReducer, useRef, useCallback, useEffect } from 'react';
import type { CarouselState, CarouselAction, ImageData } from './ImageCarouselContext';

interface UseImageCarouselOptions {
  images: ImageData[];
  loop: boolean;
  transitionDuration: number;
  width: number;
  height: number;
  autoplay: boolean;
  delay: number;
}

function createReducer(imageCount: number, loop: boolean) {
  return function carouselReducer(
    state: CarouselState,
    action: CarouselAction,
  ): CarouselState {
    switch (action.type) {
      case 'NEXT_IMAGE': {
        const next = state.currentIndex + 1;
        const currentIndex = loop ? next % imageCount : Math.min(next, imageCount - 1);
        return { ...state, currentIndex, isTransitioning: currentIndex !== state.currentIndex };
      }
      case 'PREV_IMAGE': {
        const prev = state.currentIndex - 1;
        const currentIndex = loop ? (prev + imageCount) % imageCount : Math.max(prev, 0);
        return { ...state, currentIndex, isTransitioning: currentIndex !== state.currentIndex };
      }
      case 'SHOW_IMAGE':
        return {
          ...state,
          currentIndex: action.index,
          isTransitioning: action.index !== state.currentIndex,
        };
      case 'IMAGE_LOADED':
        return {
          ...state,
          loadedIndices: new Set([...state.loadedIndices, action.index]),
        };
      case 'SET_INTENT':
        return { ...state, intent: action.intent };
      case 'TRANSITION_END':
        return { ...state, isTransitioning: false };
      default:
        return state;
    }
  };
}

const initialState: CarouselState = {
  currentIndex: 0,
  isTransitioning: false,
  loadedIndices: new Set([0]),
  intent: 'idle',
};

export function useImageCarousel({
  images,
  loop,
  transitionDuration,
  width,
  height,
  autoplay,
  delay,
}: UseImageCarouselOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducer = useCallback(
    (state: CarouselState, action: CarouselAction) =>
      createReducer(images.length, loop)(state, action),
    [images.length, loop],
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  // Scroll viewport when currentIndex changes
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({
      left: state.currentIndex * width,
      behavior: 'smooth',
    });
  }, [state.currentIndex, width]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || state.intent === 'hover') return;

    const timer = setInterval(() => {
      dispatch({ type: 'NEXT_IMAGE' });
    }, delay);

    return () => clearInterval(timer);
  }, [autoplay, delay, state.intent, state.currentIndex]);

  // Preloading logic based on intent
  useEffect(() => {
    if (state.intent === 'hover') {
      const nextIdx = (state.currentIndex + 1) % images.length;
      if (!state.loadedIndices.has(nextIdx)) {
        const img = new Image();
        img.src = images[nextIdx].src;
        img.onload = () => dispatch({ type: 'IMAGE_LOADED', index: nextIdx });
      }
    } else if (state.intent === 'active') {
      for (let i = 1; i <= 3; i++) {
        const idx = (state.currentIndex + i) % images.length;
        if (!state.loadedIndices.has(idx)) {
          const img = new Image();
          img.src = images[idx].src;
          img.onload = () => dispatch({ type: 'IMAGE_LOADED', index: idx });
        }
      }
    }
  }, [state.intent, state.currentIndex, images, state.loadedIndices]);

  return {
    state,
    dispatch,
    viewportRef,
    images,
    loop,
    transitionDuration,
    width,
    height,
    autoplay,
    delay,
  };
}
