import { useState, useCallback, useId, useRef, useEffect } from 'react';

export interface UseModalDialogOptions {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const modalStack: string[] = [];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalDialog({
  isOpen: isOpenProp,
  defaultOpen = false,
  onClose,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: UseModalDialogOptions) {
  const id = useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : internalOpen;

  const handleOpen = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true);
    }
  }, [isControlled]);

  const handleClose = useCallback(() => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
      onClose?.();
    }
  }, [isControlled, onClose]);

  // Effect 1: Focus management + scroll lock + stack registration
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    if (!modalStack.includes(id)) {
      modalStack.push(id);
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const firstFocusable = focusable[0];
        if (focusable.length > 0 && firstFocusable) {
          firstFocusable.focus();
        }
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      const idx = modalStack.indexOf(id);
      if (idx !== -1) {
        modalStack.splice(idx, 1);
      }
      if (modalStack.length === 0) {
        document.body.style.overflow = originalOverflow;
      }
      previousFocusRef.current?.focus();
    };
  }, [isOpen, id]);

  // Effect 2: ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const topModal = modalStack[modalStack.length - 1];
        if (topModal === id) {
          e.stopPropagation();
          handleClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, id, handleClose]);

  // Effect 3: Focus trap (Tab/Shift+Tab loop)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          if (last) last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          if (first) first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return {
    isOpen,
    titleId,
    bodyId,
    containerRef,
    previousFocusRef,
    closeOnOverlayClick,
    closeOnEsc,
    handleOpen,
    handleClose,
  };
}
