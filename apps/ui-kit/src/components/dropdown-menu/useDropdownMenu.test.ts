import { renderHook, act } from '@testing-library/react';
import { useDropdownMenu } from './useDropdownMenu';

function setup(overrides = {}) {
  return renderHook(() =>
    useDropdownMenu({ strategy: 'relative', ...overrides }),
  );
}

test('initial state: closed, no active item', () => {
  const { result } = setup();
  expect(result.current.isOpen).toBe(false);
  expect(result.current.activeIndex).toBe(-1);
});

test('toggle opens and closes menu', () => {
  const { result } = setup();
  act(() => {
    result.current.toggle();
  });
  expect(result.current.isOpen).toBe(true);
  act(() => {
    result.current.toggle();
  });
  expect(result.current.isOpen).toBe(false);
});

test('close resets activeIndex to -1', () => {
  const { result } = setup();
  act(() => {
    result.current.toggle();
  });
  act(() => {
    result.current.setActiveIndex(2);
  });
  act(() => {
    result.current.close();
  });
  expect(result.current.isOpen).toBe(false);
  expect(result.current.activeIndex).toBe(-1);
});

test('registerItem tracks enabled indices', () => {
  const { result } = setup();
  act(() => {
    result.current.registerItem(0, false);
    result.current.registerItem(1, true);
    result.current.registerItem(2, false);
  });
  expect(result.current.enabledIndices).toEqual([0, 2]);
});

test('unregisterItem removes from tracking', () => {
  const { result } = setup();
  act(() => {
    result.current.registerItem(0, false);
    result.current.registerItem(1, false);
  });
  act(() => {
    result.current.unregisterItem(0);
  });
  expect(result.current.enabledIndices).toEqual([1]);
});

test('select closes menu and resets activeIndex', () => {
  const { result } = setup();
  act(() => {
    result.current.toggle();
  });
  act(() => {
    result.current.select(1);
  });
  expect(result.current.isOpen).toBe(false);
  expect(result.current.activeIndex).toBe(-1);
});

test('getItemId returns consistent id format', () => {
  const { result } = setup();
  const id0 = result.current.getItemId(0);
  const id1 = result.current.getItemId(1);
  expect(id0).toContain('0');
  expect(id1).toContain('1');
  expect(id0).not.toBe(id1);
});

test('buttonId and listId are defined', () => {
  const { result } = setup();
  expect(result.current.buttonId).toBeTruthy();
  expect(result.current.listId).toBeTruthy();
});

test('initialFocusPosition defaults to null', () => {
  const { result } = setup();
  expect(result.current.initialFocusPosition).toBeNull();
});

test('setInitialFocusPosition updates value', () => {
  const { result } = setup();
  act(() => {
    result.current.setInitialFocusPosition('last');
  });
  expect(result.current.initialFocusPosition).toBe('last');

  act(() => {
    result.current.setInitialFocusPosition('first');
  });
  expect(result.current.initialFocusPosition).toBe('first');

  act(() => {
    result.current.setInitialFocusPosition(null);
  });
  expect(result.current.initialFocusPosition).toBeNull();
});
