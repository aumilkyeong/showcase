import { useState, useCallback, useId, useRef } from 'react';

export interface UseModalDialogOptions {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

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
    }
  }, [isControlled, onClose]);

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
