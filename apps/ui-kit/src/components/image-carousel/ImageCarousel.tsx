import { type ReactNode, useMemo, useEffect } from 'react';
import {
  ImageCarouselContext,
  useImageCarouselContext,
  type ImageData,
} from './ImageCarouselContext';
import { useImageCarousel } from './useImageCarousel';
import styles from './ImageCarousel.module.css';

/* ─── Root ──────────────────────────────────────────────────────────── */

interface ImageCarouselRootProps {
  images: ImageData[];
  width?: number;
  height?: number;
  transitionDuration?: number;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
  onLoad?: () => void;
  onPageSelect?: (index: number) => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  children: ReactNode;
}

function ImageCarouselRoot({
  images,
  width = 600,
  height = 400,
  transitionDuration = 300,
  loop = true,
  autoplay = false,
  delay = 3000,
  onLoad,
  onPageSelect,
  onPrevClick,
  onNextClick,
  children,
}: ImageCarouselRootProps) {
  const hookValue = useImageCarousel({
    images,
    loop,
    transitionDuration,
    width,
    height,
    autoplay,
    delay,
  });

  useEffect(() => {
    onPageSelect?.(hookValue.state.currentIndex);
  }, [hookValue.state.currentIndex, onPageSelect]);

  useEffect(() => {
    if (hookValue.state.loadedIndices.has(0)) {
      onLoad?.();
    }
  }, [hookValue.state.loadedIndices, onLoad]);

  const contextValue = useMemo(
    () => ({
      ...hookValue,
      _onPrevClick: onPrevClick,
      _onNextClick: onNextClick,
    }),
    [hookValue, onPrevClick, onNextClick],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        hookValue.dispatch({ type: 'PREV_IMAGE' });
        hookValue.dispatch({ type: 'SET_INTENT', intent: 'active' });
        onPrevClick?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        hookValue.dispatch({ type: 'NEXT_IMAGE' });
        hookValue.dispatch({ type: 'SET_INTENT', intent: 'active' });
        onNextClick?.();
        break;
      case 'Home':
        e.preventDefault();
        hookValue.dispatch({ type: 'SHOW_IMAGE', index: 0 });
        hookValue.dispatch({ type: 'SET_INTENT', intent: 'active' });
        break;
      case 'End':
        e.preventDefault();
        hookValue.dispatch({ type: 'SHOW_IMAGE', index: images.length - 1 });
        hookValue.dispatch({ type: 'SET_INTENT', intent: 'active' });
        break;
    }
  };

  const handleMouseEnter = () => {
    hookValue.dispatch({ type: 'SET_INTENT', intent: 'hover' });
  };

  const handleMouseLeave = () => {
    hookValue.dispatch({
      type: 'SET_INTENT',
      intent: hookValue.state.intent === 'active' ? 'active' : 'idle',
    });
  };

  return (
    <ImageCarouselContext.Provider value={contextValue}>
      <div
        className={styles.container}
        style={{ width, height: 'auto' }}
        role="region"
        aria-label="Image Carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </ImageCarouselContext.Provider>
  );
}

/* ─── Viewport ─────────────────────────────────────────────────────── */

function Viewport() {
  const ctx = useImageCarouselContext();
  const { images, width, height, state, dispatch, viewportRef, autoplay } = ctx;

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      style={{ width, height }}
      aria-live={autoplay ? 'off' : 'polite'}
    >
      {images.map((image, index) => (
        <div
          key={image.src}
          className={styles.slide}
          style={{ width, height }}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${images.length}`}
        >
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={`${width}px`}
            alt={image.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={() => dispatch({ type: 'IMAGE_LOADED', index })}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Prev ─────────────────────────────────────────────────────────── */

interface NavButtonProps {
  'aria-label'?: string;
}

function Prev({ 'aria-label': ariaLabel = '이전 이미지' }: NavButtonProps) {
  const ctx = useImageCarouselContext();
  const { state, dispatch, loop } = ctx;
  const disabled = !loop && state.currentIndex === 0;

  const handleClick = () => {
    dispatch({ type: 'PREV_IMAGE' });
    dispatch({ type: 'SET_INTENT', intent: 'active' });
    (ctx as any)._onPrevClick?.();
  };

  return (
    <button
      type="button"
      className={`${styles.navButton} ${styles.prevButton}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      &#8249;
    </button>
  );
}

/* ─── Next ─────────────────────────────────────────────────────────── */

function Next({ 'aria-label': ariaLabel = '다음 이미지' }: NavButtonProps) {
  const ctx = useImageCarouselContext();
  const { state, dispatch, loop, images } = ctx;
  const disabled = !loop && state.currentIndex === images.length - 1;

  const handleClick = () => {
    dispatch({ type: 'NEXT_IMAGE' });
    dispatch({ type: 'SET_INTENT', intent: 'active' });
    (ctx as any)._onNextClick?.();
  };

  return (
    <button
      type="button"
      className={`${styles.navButton} ${styles.nextButton}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      &#8250;
    </button>
  );
}

/* ─── Dots ─────────────────────────────────────────────────────────── */

function Dots() {
  const { images, state, dispatch } = useImageCarouselContext();

  return (
    <ul className={styles.dots} role="tablist">
      {images.map((_, index) => (
        <li key={index}>
          <button
            type="button"
            role="tab"
            className={`${styles.dot} ${state.currentIndex === index ? styles.dotActive : ''}`}
            aria-selected={state.currentIndex === index}
            aria-label={`${index + 1}번째 이미지로 이동`}
            onClick={() => {
              dispatch({ type: 'SHOW_IMAGE', index });
              dispatch({ type: 'SET_INTENT', intent: 'active' });
            }}
          />
        </li>
      ))}
    </ul>
  );
}

/* ─── Export ────────────────────────────────────────────────────────── */

export const ImageCarousel = Object.assign(ImageCarouselRoot, {
  Viewport,
  Prev,
  Next,
  Dots,
});
