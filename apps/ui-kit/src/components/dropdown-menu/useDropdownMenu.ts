import { useState, useCallback, useId, useRef, useMemo } from 'react';

export interface UseDropdownMenuOptions {
  strategy: 'relative' | 'portal';
}

export function useDropdownMenu({ strategy }: UseDropdownMenuOptions) {
  const id = useId();
  const buttonId = `${id}-button`;
  const listId = `${id}-list`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [itemRegistry, setItemRegistry] = useState<
    Map<number, { disabled: boolean }>
  >(new Map());

  const enabledIndices = useMemo(() => {
    return Array.from(itemRegistry.entries())
      .filter(([, val]) => !val.disabled)
      .map(([idx]) => idx)
      .sort((a, b) => a - b);
  }, [itemRegistry]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setActiveIndex(-1);
      }
      return !prev;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const select = useCallback(
    (_index: number) => {
      close();
    },
    [close],
  );

  const getItemId = useCallback(
    (index: number) => `${id}-item-${index}`,
    [id],
  );

  const registerItem = useCallback((index: number, disabled: boolean) => {
    setItemRegistry((prev) => {
      const next = new Map(prev);
      next.set(index, { disabled });
      return next;
    });
  }, []);

  const unregisterItem = useCallback((index: number) => {
    setItemRegistry((prev) => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
  }, []);

  return {
    isOpen,
    activeIndex,
    buttonId,
    listId,
    strategy,
    buttonRef,
    listRef,
    enabledIndices,
    toggle,
    close,
    select,
    setActiveIndex,
    getItemId,
    registerItem,
    unregisterItem,
  };
}
