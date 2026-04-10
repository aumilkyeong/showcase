import { renderHook, act } from '@testing-library/react';
import { useModalDialog } from './useModalDialog';

test('controlled mode: isOpen reflects prop', () => {
  const onClose = vi.fn();
  const { result, rerender } = renderHook(
    (props) => useModalDialog(props),
    { initialProps: { isOpen: false, onClose } },
  );
  expect(result.current.isOpen).toBe(false);
  rerender({ isOpen: true, onClose });
  expect(result.current.isOpen).toBe(true);
});

test('controlled mode: handleClose calls onClose', () => {
  const onClose = vi.fn();
  const { result } = renderHook(() =>
    useModalDialog({ isOpen: true, onClose }),
  );
  act(() => { result.current.handleClose(); });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('uncontrolled mode: defaults to closed', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.isOpen).toBe(false);
});

test('uncontrolled mode: defaultOpen=true starts open', () => {
  const { result } = renderHook(() =>
    useModalDialog({ defaultOpen: true }),
  );
  expect(result.current.isOpen).toBe(true);
});

test('uncontrolled mode: handleOpen/handleClose toggles state', () => {
  const { result } = renderHook(() => useModalDialog({}));
  act(() => { result.current.handleOpen(); });
  expect(result.current.isOpen).toBe(true);
  act(() => { result.current.handleClose(); });
  expect(result.current.isOpen).toBe(false);
});

test('generates unique titleId and bodyId', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.titleId).toBeTruthy();
  expect(result.current.bodyId).toBeTruthy();
  expect(result.current.titleId).not.toBe(result.current.bodyId);
});

test('closeOnEsc default is true', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.closeOnEsc).toBe(true);
});

test('closeOnOverlayClick default is true', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.closeOnOverlayClick).toBe(true);
});

test('closeOnEsc=false overrides default', () => {
  const { result } = renderHook(() => useModalDialog({ closeOnEsc: false }));
  expect(result.current.closeOnEsc).toBe(false);
});

test('closeOnOverlayClick=false overrides default', () => {
  const { result } = renderHook(() => useModalDialog({ closeOnOverlayClick: false }));
  expect(result.current.closeOnOverlayClick).toBe(false);
});

test('containerRef starts as null', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.containerRef.current).toBeNull();
});

test('previousFocusRef starts as null', () => {
  const { result } = renderHook(() => useModalDialog({}));
  expect(result.current.previousFocusRef.current).toBeNull();
});
