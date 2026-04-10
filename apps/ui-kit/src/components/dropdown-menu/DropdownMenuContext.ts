import { createContext, useContext } from 'react';

export interface DropdownMenuContextValue {
  isOpen: boolean;
  activeIndex: number;
  buttonId: string;
  listId: string;
  strategy: 'relative' | 'portal';
  getItemId: (index: number) => string;
  toggle: () => void;
  close: () => void;
  setActiveIndex: (index: number) => void;
  enabledIndices: number[];
  registerItem: (index: number, disabled: boolean) => void;
  unregisterItem: (index: number) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
  select: () => void;
  onItemClick?: (index: number) => void;
  initialFocusPosition: 'first' | 'last' | null;
  setInitialFocusPosition: (position: 'first' | 'last' | null) => void;
}

export const DropdownMenuContext =
  createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenuContext(): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      'DropdownMenu compound components must be used within <DropdownMenu>',
    );
  }
  return context;
}
