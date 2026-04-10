import {
  type ReactNode,
  type CSSProperties,
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import {
  ModalDialogContext,
  useModalDialogContext,
} from './ModalDialogContext';
import {
  useModalDialog,
  type UseModalDialogOptions,
} from './useModalDialog';
import styles from './ModalDialog.module.css';

/* ─── Root ──────────────────────────────────────────────────────────── */

interface ModalDialogRootProps extends UseModalDialogOptions {
  children: ReactNode;
  width?: CSSProperties['width'];
  maxHeight?: CSSProperties['maxHeight'];
  closeLabel?: string;
  className?: string;
}

function ModalDialogRoot({
  children,
  width,
  maxHeight,
  closeLabel = 'Close dialog',
  className,
  ...options
}: ModalDialogRootProps) {
  const state = useModalDialog(options);
  const [shouldRender, setShouldRender] = useState(state.isOpen);
  const [animateOpen, setAnimateOpen] = useState(false);

  // Animation: enter/exit transitions
  useEffect(() => {
    if (state.isOpen) {
      setShouldRender(true);
      let cancelled = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setAnimateOpen(true);
        });
      });
      return () => { cancelled = true; };
    } else {
      setAnimateOpen(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [state.isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && state.closeOnOverlayClick) {
        state.handleClose();
      }
    },
    [state.closeOnOverlayClick, state.handleClose],
  );

  const contextValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      titleId: state.titleId,
      bodyId: state.bodyId,
      closeOnOverlayClick: state.closeOnOverlayClick,
      closeOnEsc: state.closeOnEsc,
      containerRef: state.containerRef,
      closeLabel,
      handleOpen: state.handleOpen,
      handleClose: state.handleClose,
    }),
    [
      state.isOpen,
      state.titleId,
      state.bodyId,
      state.closeOnOverlayClick,
      state.closeOnEsc,
      state.containerRef,
      closeLabel,
      state.handleOpen,
      state.handleClose,
    ],
  );

  // Separate triggers from content children
  const triggers: ReactNode[] = [];
  const content: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Trigger) {
      triggers.push(child);
    } else {
      content.push(child);
    }
  });

  const containerStyle: CSSProperties = {};
  if (width !== undefined) containerStyle.width = width;
  if (maxHeight !== undefined) containerStyle.maxHeight = maxHeight;

  return (
    <ModalDialogContext.Provider value={contextValue}>
      {triggers}
      {shouldRender &&
        ReactDOM.createPortal(
          <>
            <div
              className={`${styles.overlay} ${animateOpen ? styles.overlayOpen : ''}`}
            />
            <div className={styles.wrapper} onClick={handleOverlayClick}>
              <div
                ref={state.containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={state.titleId}
                aria-describedby={state.bodyId}
                className={`${styles.container} ${animateOpen ? styles.containerOpen : ''} ${className ?? ''}`}
                style={
                  Object.keys(containerStyle).length > 0
                    ? containerStyle
                    : undefined
                }
              >
                {content}
              </div>
            </div>
          </>,
          document.body,
        )}
    </ModalDialogContext.Provider>
  );
}

/* ─── Trigger ───────────────────────────────────────────────────────── */

interface TriggerProps {
  children: ReactNode;
}

function Trigger({ children }: TriggerProps) {
  const ctx = useModalDialogContext();

  if (!isValidElement<{ onClick?: () => void }>(children)) {
    return <>{children}</>;
  }

  return cloneElement(children, {
    onClick: () => {
      children.props.onClick?.();
      ctx.handleOpen();
    },
  });
}

/* ─── Header ────────────────────────────────────────────────────────── */

interface HeaderProps {
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

function Header({ children, showCloseButton = true, className }: HeaderProps) {
  const ctx = useModalDialogContext();

  return (
    <div className={`${styles.header} ${className ?? ''}`}>
      <h2 id={ctx.titleId} className={styles.headerTitle}>
        {children}
      </h2>
      {showCloseButton && (
        <button
          type="button"
          className={styles.closeButton}
          aria-label={ctx.closeLabel}
          onClick={ctx.handleClose}
        >
          ×
        </button>
      )}
    </div>
  );
}

/* ─── Body ──────────────────────────────────────────────────────────── */

interface BodyProps {
  children: ReactNode;
  className?: string;
}

function Body({ children, className }: BodyProps) {
  const ctx = useModalDialogContext();

  return (
    <div id={ctx.bodyId} className={`${styles.body} ${className ?? ''}`}>
      {children}
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */

interface FooterProps {
  children: ReactNode;
  className?: string;
}

function Footer({ children, className }: FooterProps) {
  return <div className={`${styles.footer} ${className ?? ''}`}>{children}</div>;
}

/* ─── Export ─────────────────────────────────────────────────────────── */

export const ModalDialog = Object.assign(ModalDialogRoot, {
  Trigger,
  Header,
  Body,
  Footer,
});
