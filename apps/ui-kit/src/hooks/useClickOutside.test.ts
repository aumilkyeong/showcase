import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from './useClickOutside';

test('calls handler when clicking outside the ref element', () => {
  const handler = vi.fn();
  const div = document.createElement('div');
  document.body.appendChild(div);

  renderHook(() => {
    const ref = useRef<HTMLElement>(div);
    useClickOutside(ref, handler);
  });

  document.body.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true }),
  );
  expect(handler).toHaveBeenCalledTimes(1);

  document.body.removeChild(div);
});

test('does not call handler when clicking inside the ref element', () => {
  const handler = vi.fn();
  const div = document.createElement('div');
  document.body.appendChild(div);

  renderHook(() => {
    const ref = useRef<HTMLElement>(div);
    useClickOutside(ref, handler);
  });

  div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  expect(handler).not.toHaveBeenCalled();

  document.body.removeChild(div);
});
