import {
  type ReactNode,
  type CSSProperties,
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
}

function ModalDialogRoot({
  children,
  width,
  maxHeight,
  ...options
}: ModalDialogRootProps) {
  const state = useModalDialog(options);
  const [shouldRender, setShouldRender] = useState(state.isOpen);
  const [animateOpen, setAnimateOpen] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Animation: enter/exit transitions
  useEffect(() => {
    if (state.isOpen) {
      setShouldRender(true);
      // Double rAF to ensure DOM is painted before animating
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setAnimateOpen(true);
        });
        // Store raf2 for cleanup
        rafRef2.current = raf2;
      });
      rafRef1.current = raf1;
      return () => {
        cancelAnimationFrame(rafRef1.current);
        cancelAnimationFrame(rafRef2.current);
      };
    } else {
      setAnimateOpen(false);
      exitTimerRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => {
        clearTimeout(exitTimerRef.current);
      };
    }
  }, [state.isOpen]);

  const rafRef1 = useRef<number>(0);
  const rafRef2 = useRef<number>(0);

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
                className={`${styles.container} ${animateOpen ? styles.containerOpen : ''}`}
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
}

function Header({ children, showCloseButton = true }: HeaderProps) {
  const ctx = useModalDialogContext();

  return (
    <div className={styles.header}>
      <h2 id={ctx.titleId} className={styles.headerTitle}>
        {children}
      </h2>
      {showCloseButton && (
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close dialog"
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
}

function Body({ children }: BodyProps) {
  const ctx = useModalDialogContext();

  return (
    <div id={ctx.bodyId} className={styles.body}>
      {children}
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */

interface FooterProps {
  children: ReactNode;
}

function Footer({ children }: FooterProps) {
  return <div className={styles.footer}>{children}</div>;
}

/* ─── Export ─────────────────────────────────────────────────────────── */

export const ModalDialog = Object.assign(ModalDialogRoot, {
  Trigger,
  Header,
  Body,
  Footer,
});
