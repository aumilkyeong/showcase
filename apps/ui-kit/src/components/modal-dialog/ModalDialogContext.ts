import { createContext, useContext } from 'react';

export interface ModalDialogContextValue {
  isOpen: boolean;
  titleId: string;
  bodyId: string;
  closeOnOverlayClick: boolean;
  closeOnEsc: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleOpen: () => void;
  handleClose: () => void;
}

export const ModalDialogContext =
  createContext<ModalDialogContextValue | null>(null);

export function useModalDialogContext(): ModalDialogContextValue {
  const context = useContext(ModalDialogContext);
  if (!context) {
    throw new Error(
      'ModalDialog compound components must be used within <ModalDialog>',
    );
  }
  return context;
}
