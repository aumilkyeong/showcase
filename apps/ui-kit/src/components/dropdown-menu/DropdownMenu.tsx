import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type LiHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { DropdownMenuContext } from './DropdownMenuContext';
import { useDropdownMenuContext } from './DropdownMenuContext';
import { useDropdownMenu } from './useDropdownMenu';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './DropdownMenu.module.css';

/* ─── Root ──────────────────────────────────────────────────────────── */

interface DropdownMenuRootProps {
  children: ReactNode;
  strategy?: 'relative' | 'portal';
}

function DropdownMenuRoot({
  children,
  strategy = 'relative',
}: DropdownMenuRootProps) {
  const state = useDropdownMenu({ strategy });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleItemClick = useCallback(
    (index: number) => {
      state.select(index);
      state.buttonRef.current?.focus();
    },
    [state],
  );

  useClickOutside(containerRef, state.close);

  const contextValue = {
    ...state,
    onItemClick: handleItemClick,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div ref={containerRef} className={styles.container}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

/* ─── Button ────────────────────────────────────────────────────────── */

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-haspopup' | 'aria-expanded' | 'aria-controls'
> & {
  children: ReactNode;
};

function Button({ children, onClick, onKeyDown, ...rest }: ButtonProps) {
  const ctx = useDropdownMenuContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    ctx.toggle();
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!ctx.isOpen) ctx.toggle();
      // List's useEffect will auto-focus first enabled item on open
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!ctx.isOpen) ctx.toggle();
      // List's useEffect will auto-focus first enabled item on open
      // For ArrowUp we want last item, but this is handled by auto-focus for now
    }
    onKeyDown?.(e);
  };

  return (
    <button
      ref={ctx.buttonRef}
      id={ctx.buttonId}
      type="button"
      aria-haspopup="menu"
      aria-expanded={ctx.isOpen}
      aria-controls={ctx.isOpen ? ctx.listId : undefined}
      className={`${styles.button} ${ctx.isOpen ? styles.buttonOpen : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─── List ──────────────────────────────────────────────────────────── */

interface ListProps {
  children: ReactNode;
}

function List({ children }: ListProps) {
  const ctx = useDropdownMenuContext();
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });

  // Calculate position for portal strategy
  useEffect(() => {
    if (!ctx.isOpen || ctx.strategy !== 'portal') return;

    const updatePosition = () => {
      const button = ctx.buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      setPortalPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [ctx.isOpen, ctx.strategy, ctx.buttonRef]);

  // Focus first enabled item on open
  useEffect(() => {
    if (!ctx.isOpen) return;
    const list = ctx.listRef.current;
    if (!list) return;
    const items = list.querySelectorAll<HTMLElement>('[role="menuitem"]');
    for (const item of items) {
      if (item.getAttribute('aria-disabled') !== 'true') {
        item.focus();
        break;
      }
    }
  }, [ctx.isOpen, ctx.listRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const list = ctx.listRef.current;
    if (!list) return;

    const items = Array.from(
      list.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const enabledItems = items.filter(
      (item) => item.getAttribute('aria-disabled') !== 'true',
    );

    if (enabledItems.length === 0) return;

    const currentFocused = document.activeElement as HTMLElement;
    const currentEnabledIndex = enabledItems.indexOf(currentFocused);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex =
          currentEnabledIndex < 0
            ? 0
            : (currentEnabledIndex + 1) % enabledItems.length;
        enabledItems[nextIndex].focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex =
          currentEnabledIndex <= 0
            ? enabledItems.length - 1
            : currentEnabledIndex - 1;
        enabledItems[prevIndex].focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        enabledItems[0].focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        enabledItems[enabledItems.length - 1].focus();
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (currentFocused && items.includes(currentFocused)) {
          currentFocused.click();
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        ctx.close();
        ctx.buttonRef.current?.focus();
        break;
      }
      case 'Tab': {
        e.preventDefault();
        ctx.close();
        ctx.buttonRef.current?.focus();
        break;
      }
    }
  };

  if (!ctx.isOpen) return null;

  const menuEl = (
    <ul
      ref={ctx.listRef}
      id={ctx.listId}
      role="menu"
      aria-labelledby={ctx.buttonId}
      className={ctx.strategy === 'portal' ? styles.menuPortal : styles.menu}
      style={
        ctx.strategy === 'portal'
          ? { top: portalPosition.top, left: portalPosition.left }
          : undefined
      }
      onKeyDown={handleKeyDown}
    >
      {children}
    </ul>
  );

  if (ctx.strategy === 'portal') {
    return ReactDOM.createPortal(menuEl, document.body);
  }

  return menuEl;
}

/* ─── Item ──────────────────────────────────────────────────────────── */

interface ItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'role'> {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

function Item({ children, disabled = false, onClick, ...rest }: ItemProps) {
  const ctx = useDropdownMenuContext();
  const itemRef = useRef<HTMLLIElement>(null);
  const [index, setIndex] = useState(-1);

  // Register/unregister with context and determine index
  useEffect(() => {
    const list = ctx.listRef.current;
    if (!list || !itemRef.current) return;

    const items = Array.from(
      list.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const idx = items.indexOf(itemRef.current);
    setIndex(idx);
    ctx.registerItem(idx, disabled);

    return () => {
      ctx.unregisterItem(idx);
    };
  }, [disabled, ctx.registerItem, ctx.unregisterItem, ctx.listRef]);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    ctx.onItemClick?.(index);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    ctx.setActiveIndex(index);
  };

  return (
    <li
      ref={itemRef}
      id={ctx.getItemId(index)}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled ? 'true' : undefined}
      className={`${styles.item} ${disabled ? styles.itemDisabled : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      {children}
    </li>
  );
}

/* ─── Export ─────────────────────────────────────────────────────────── */

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Button,
  List,
  Item,
});
