import { renderHook, act } from '@testing-library/react';
import { useImageCarousel } from './useImageCarousel';

const threeImages = [
  { src: 'https://picsum.photos/id/10/600/400', alt: 'Image 1' },
  { src: 'https://picsum.photos/id/20/600/400', alt: 'Image 2' },
  { src: 'https://picsum.photos/id/30/600/400', alt: 'Image 3' },
];

function setup(overrides = {}) {
  return renderHook(() =>
    useImageCarousel({
      images: threeImages,
      loop: true,
      width: 600,
      height: 400,
      autoplay: false,
      delay: 3000,
      ...overrides,
    }),
  );
}

test('initial state: currentIndex is 0, intent is idle', () => {
  const { result } = setup();
  expect(result.current.state.currentIndex).toBe(0);
  expect(result.current.state.intent).toBe('idle');
  expect(result.current.state.isTransitioning).toBe(false);
});

test('NEXT_IMAGE advances index', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(1);
});

test('NEXT_IMAGE wraps around when loop is true', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(0);
});

test('NEXT_IMAGE clamps at last index when loop is false', () => {
  const { result } = setup({ loop: false });
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(2);
});

test('PREV_IMAGE decrements index', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  act(() => result.current.dispatch({ type: 'PREV_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(0);
});

test('PREV_IMAGE wraps to last when loop is true', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'PREV_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(2);
});

test('PREV_IMAGE clamps at 0 when loop is false', () => {
  const { result } = setup({ loop: false });
  act(() => result.current.dispatch({ type: 'PREV_IMAGE' }));
  expect(result.current.state.currentIndex).toBe(0);
});

test('SHOW_IMAGE jumps to specific index', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'SHOW_IMAGE', index: 2 }));
  expect(result.current.state.currentIndex).toBe(2);
});

test('SET_INTENT updates intent', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'SET_INTENT', intent: 'hover' }));
  expect(result.current.state.intent).toBe('hover');
  act(() => result.current.dispatch({ type: 'SET_INTENT', intent: 'active' }));
  expect(result.current.state.intent).toBe('active');
});

test('IMAGE_LOADED adds index to loadedIndices', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'IMAGE_LOADED', index: 1 }));
  expect(result.current.state.loadedIndices.has(1)).toBe(true);
});

test('TRANSITION_END sets isTransitioning to false', () => {
  const { result } = setup();
  act(() => result.current.dispatch({ type: 'NEXT_IMAGE' }));
  expect(result.current.state.isTransitioning).toBe(true);
  act(() => result.current.dispatch({ type: 'TRANSITION_END' }));
  expect(result.current.state.isTransitioning).toBe(false);
});

test('viewportRef is defined', () => {
  const { result } = setup();
  expect(result.current.viewportRef).toBeDefined();
  expect(result.current.viewportRef.current).toBeNull();
});
