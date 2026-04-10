import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalDialog, useModalDialogContext } from '@/components/modal-dialog';
import styles from './ModalDialogPage.module.css';

function CloseButton({ label }: { label: string }) {
  const ctx = useModalDialogContext();
  return (
    <button className={styles.demoButton} onClick={ctx.handleClose}>
      {label}
    </button>
  );
}

/* ─── Step 01: Controlled vs Uncontrolled ──────────────────────────── */

function BasicDemo() {
  const { t } = useTranslation('modal-dialog');
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className={styles.comparisonRow}>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.basic.controlledLabel')}
        </p>
        <button
          className={styles.demoButton}
          onClick={() => setControlledOpen(true)}
        >
          {t('steps.basic.openControlled')}
        </button>
        <ModalDialog
          isOpen={controlledOpen}
          onClose={() => setControlledOpen(false)}
          closeLabel={t('closeLabel')}
        >
          <ModalDialog.Header>{t('steps.basic.controlledTitle')}</ModalDialog.Header>
          <ModalDialog.Body>{t('steps.basic.controlledBody')}</ModalDialog.Body>
          <ModalDialog.Footer>
            <button className={styles.demoButton} onClick={() => setControlledOpen(false)}>
              {t('steps.basic.close')}
            </button>
            <button className={`${styles.demoButton} ${styles.demoButtonPrimary}`} onClick={() => setControlledOpen(false)}>
              {t('steps.basic.confirm')}
            </button>
          </ModalDialog.Footer>
        </ModalDialog>
      </div>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.basic.uncontrolledLabel')}
        </p>
        <ModalDialog closeLabel={t('closeLabel')}>
          <ModalDialog.Trigger>
            <button className={styles.demoButton}>
              {t('steps.basic.openUncontrolled')}
            </button>
          </ModalDialog.Trigger>
          <ModalDialog.Header>{t('steps.basic.uncontrolledTitle')}</ModalDialog.Header>
          <ModalDialog.Body>{t('steps.basic.uncontrolledBody')}</ModalDialog.Body>
          <ModalDialog.Footer>
            <CloseButton label={t('steps.basic.close')} />
          </ModalDialog.Footer>
        </ModalDialog>
      </div>
    </div>
  );
}

/* ─── Step 02: Composition Pattern ─────────────────────────────────── */

function CompositionDemo() {
  const { t } = useTranslation('modal-dialog');
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.comparisonRow}>
        <div className={styles.comparisonBox}>
          <p className={styles.comparisonLabel}>
            {t('steps.composition.singleLabel')}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'Modal'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'title'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            <span className={styles.codeString}>{'"My Modal"'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'body'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            <span className={styles.codeString}>{'"Content..."'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'footer'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            {'{buttons}'}
            {'\n'}
            <span className={styles.codeKeyword}>{'/>'}</span>
          </div>
        </div>
        <div className={styles.comparisonBox}>
          <p className={styles.comparisonLabel}>
            {t('steps.composition.compoundLabel')}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'ModalDialog'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'ModalDialog.Header'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'...'}
            <span className={styles.codeKeyword}>{'</…>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'ModalDialog.Body'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'...'}
            <span className={styles.codeKeyword}>{'</…>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'ModalDialog.Footer'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'...'}
            <span className={styles.codeKeyword}>{'</…>'}</span>
            {'\n'}
            <span className={styles.codeKeyword}>{'</'}</span>
            <span className={styles.codeComponent}>{'ModalDialog'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
          </div>
        </div>
      </div>
      <button className={styles.demoButton} onClick={() => setOpen(true)}>
        {t('steps.composition.openModal')}
      </button>
      <ModalDialog isOpen={open} onClose={() => setOpen(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.composition.modalTitle')}</ModalDialog.Header>
        <ModalDialog.Body>{t('steps.composition.body')}</ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen(false)}>
            {t('steps.composition.close')}
          </button>
          <button className={`${styles.demoButton} ${styles.demoButtonPrimary}`} onClick={() => setOpen(false)}>
            {t('steps.composition.confirm')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

/* ─── Step 03: Portal ──────────────────────────────────────────────── */

function PortalDemo() {
  const { t } = useTranslation('modal-dialog');
  const [noPortalOpen, setNoPortalOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  return (
    <div className={styles.comparisonRow}>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.portal.withoutPortal')}
        </p>
        <div className={styles.overflowContainer}>
          <span className={styles.overflowTag}>overflow: hidden</span>
          {!noPortalOpen ? (
            <button
              className={styles.demoButton}
              onClick={() => setNoPortalOpen(true)}
            >
              {t('steps.portal.withoutPortal')}
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  background: '#101010',
                  border: '1px solid #3d3a39',
                  borderRadius: 8,
                  padding: 20,
                  width: 280,
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#f2f2f2' }}>
                  {t('steps.portal.modalTitle')}
                </h3>
                <p style={{ fontSize: 13, color: '#8b949e', margin: '0 0 12px' }}>
                  {t('steps.portal.clippedNote')}
                </p>
                <button
                  className={styles.demoButton}
                  onClick={() => setNoPortalOpen(false)}
                  style={{ fontSize: 12 }}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.portal.withPortal')}
        </p>
        <div className={styles.overflowContainer}>
          <span className={styles.overflowTag}>overflow: hidden</span>
          <button
            className={styles.demoButton}
            onClick={() => setPortalOpen(true)}
          >
            {t('steps.portal.withPortal')}
          </button>
        </div>
        <ModalDialog isOpen={portalOpen} onClose={() => setPortalOpen(false)} closeLabel={t('closeLabel')}>
          <ModalDialog.Header>{t('steps.portal.modalTitle')}</ModalDialog.Header>
          <ModalDialog.Body>{t('steps.portal.body')}</ModalDialog.Body>
          <ModalDialog.Footer>
            <button className={styles.demoButton} onClick={() => setPortalOpen(false)}>
              OK
            </button>
          </ModalDialog.Footer>
        </ModalDialog>
      </div>
    </div>
  );
}

/* ─── Step 04: Focus Trap ──────────────────────────────────────────── */

function FocusTrapDemo() {
  const { t } = useTranslation('modal-dialog');
  const [open, setOpen] = useState(false);
  const [focusedEl, setFocusedEl] = useState('');

  const handleFocusCapture = useCallback((e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    const label =
      target.getAttribute('aria-label') ||
      target.textContent ||
      target.tagName;
    setFocusedEl(label ?? '');
  }, []);

  return (
    <>
      <button className={styles.demoButton} onClick={() => setOpen(true)}>
        {t('steps.focusTrap.open')}
      </button>
      <ModalDialog isOpen={open} onClose={() => setOpen(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.focusTrap.modalTitle')}</ModalDialog.Header>
        <ModalDialog.Body>
          <div onFocusCapture={handleFocusCapture}>
            <label className={styles.demoLabel}>{t('steps.focusTrap.name')}</label>
            <input className={styles.demoInput} type="text" aria-label={t('steps.focusTrap.name')} />
            <label className={styles.demoLabel}>{t('steps.focusTrap.email')}</label>
            <input className={styles.demoInput} type="email" aria-label={t('steps.focusTrap.email')} />
            {focusedEl && (
              <p className={styles.focusIndicator}>
                {t('steps.focusTrap.focusIndicator')}: {focusedEl}
              </p>
            )}
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen(false)}>
            {t('steps.focusTrap.cancel')}
          </button>
          <button className={`${styles.demoButton} ${styles.demoButtonPrimary}`} onClick={() => setOpen(false)}>
            {t('steps.focusTrap.submit')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

/* ─── Step 05: Animation ───────────────────────────────────────────── */

function AnimationDemo() {
  const { t } = useTranslation('modal-dialog');
  const [open, setOpen] = useState(false);

  return (
    <>
      <p style={{ color: '#8b949e', fontSize: 14, margin: '0 0 12px' }}>
        {t('steps.animation.siblingLabel')}
      </p>
      <button className={styles.demoButton} onClick={() => setOpen(true)}>
        {t('steps.animation.open')}
      </button>
      <ModalDialog isOpen={open} onClose={() => setOpen(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.animation.modalTitle')}</ModalDialog.Header>
        <ModalDialog.Body>{t('steps.animation.body')}</ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen(false)}>
            OK
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

/* ─── Step 06: Native Dialog Comparison ────────────────────────────── */

function NativeDialogDemo() {
  const { t } = useTranslation('modal-dialog');
  const [customOpen, setCustomOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className={styles.comparisonRow}>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.nativeDialog.customLabel')}
        </p>
        <button
          className={styles.demoButton}
          onClick={() => setCustomOpen(true)}
        >
          {t('steps.nativeDialog.openCustom')}
        </button>
        <ModalDialog isOpen={customOpen} onClose={() => setCustomOpen(false)} width={360} closeLabel={t('closeLabel')}>
          <ModalDialog.Header>{t('steps.nativeDialog.modalTitle')}</ModalDialog.Header>
          <ModalDialog.Body>
            <label className={styles.demoLabel}>{t('steps.nativeDialog.input1')}</label>
            <input className={styles.demoInput} type="text" />
            <label className={styles.demoLabel}>{t('steps.nativeDialog.input2')}</label>
            <input className={styles.demoInput} type="text" />
          </ModalDialog.Body>
          <ModalDialog.Footer>
            <button className={styles.demoButton} onClick={() => setCustomOpen(false)}>
              {t('steps.nativeDialog.close')}
            </button>
          </ModalDialog.Footer>
        </ModalDialog>
      </div>
      <div className={styles.comparisonBox}>
        <p className={styles.comparisonLabel}>
          {t('steps.nativeDialog.nativeLabel')}
        </p>
        <button
          className={styles.demoButton}
          onClick={() => dialogRef.current?.showModal()}
        >
          {t('steps.nativeDialog.openNative')}
        </button>
        <dialog
          ref={dialogRef}
          style={{
            background: '#101010',
            border: '1px solid #3d3a39',
            borderRadius: 8,
            color: '#f2f2f2',
            padding: 20,
            maxWidth: 360,
            margin: 'auto',
            position: 'fixed',
            inset: 0,
            height: 'fit-content',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
            {t('steps.nativeDialog.modalTitle')}
          </h3>
          <label className={styles.demoLabel}>{t('steps.nativeDialog.input1')}</label>
          <input className={styles.demoInput} type="text" />
          <label className={styles.demoLabel}>{t('steps.nativeDialog.input2')}</label>
          <input className={styles.demoInput} type="text" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              className={styles.demoButton}
              onClick={() => dialogRef.current?.close()}
            >
              {t('steps.nativeDialog.close')}
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
}

/* ─── Step 07: Stacked Modals ──────────────────────────────────────── */

function StackedDemo() {
  const { t } = useTranslation('modal-dialog');
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const depth = Number(open1) + Number(open2) + Number(open3);

  return (
    <>
      <button className={styles.demoButton} onClick={() => setOpen1(true)}>
        {t('steps.stacked.open')}
      </button>
      {depth > 0 && (
        <p className={styles.stackDepth}>
          {t('steps.stacked.stackDepth', { depth })}
        </p>
      )}
      <ModalDialog isOpen={open1} onClose={() => setOpen1(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.stacked.title1')}</ModalDialog.Header>
        <ModalDialog.Body>
          <p>{t('steps.stacked.body1')}</p>
          <button className={styles.demoButton} onClick={() => setOpen2(true)}>
            {t('steps.stacked.openNext')}
          </button>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen1(false)}>
            {t('steps.stacked.close')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
      <ModalDialog isOpen={open2} onClose={() => setOpen2(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.stacked.title2')}</ModalDialog.Header>
        <ModalDialog.Body>
          <p>{t('steps.stacked.body2')}</p>
          <button className={styles.demoButton} onClick={() => setOpen3(true)}>
            {t('steps.stacked.openNext')}
          </button>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen2(false)}>
            {t('steps.stacked.close')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
      <ModalDialog isOpen={open3} onClose={() => setOpen3(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.stacked.title3')}</ModalDialog.Header>
        <ModalDialog.Body>{t('steps.stacked.body3')}</ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen3(false)}>
            {t('steps.stacked.close')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

/* ─── Step 08: Keyboard Demo ───────────────────────────────────────── */

function KeyboardDemo() {
  const { t } = useTranslation('modal-dialog');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.demoButton} onClick={() => setOpen(true)}>
        {t('steps.keyboard.open')}
      </button>
      <ModalDialog isOpen={open} onClose={() => setOpen(false)} closeLabel={t('closeLabel')}>
        <ModalDialog.Header>{t('steps.keyboard.modalTitle')}</ModalDialog.Header>
        <ModalDialog.Body>{t('steps.keyboard.body')}</ModalDialog.Body>
        <ModalDialog.Footer>
          <button className={styles.demoButton} onClick={() => setOpen(false)}>
            {t('steps.keyboard.cancel')}
          </button>
          <button className={`${styles.demoButton} ${styles.demoButtonPrimary}`} onClick={() => setOpen(false)}>
            {t('steps.keyboard.confirm')}
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────── */

export default function ModalDialogPage() {
  const { t } = useTranslation('modal-dialog');

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.overline}>{t('hero.overline')}</p>
        <h2 className={styles.title}>{t('hero.title')}</h2>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
      </header>

      {/* Step 01: Basic — Controlled vs Uncontrolled */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>01</span>
          <h3 className={styles.stepTitle}>{t('steps.basic.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.basic.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.basic.hint')}</p>
          <BasicDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.basic.insight')}</p>
        </div>
      </section>

      {/* Step 02: Composition */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>02</span>
          <h3 className={styles.stepTitle}>{t('steps.composition.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.composition.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 640 }}>
          <p className={styles.hint}>{t('steps.composition.hint')}</p>
          <CompositionDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.composition.insight')}</p>
        </div>
      </section>

      {/* Step 03: Portal */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>03</span>
          <h3 className={styles.stepTitle}>{t('steps.portal.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.portal.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.portal.hint')}</p>
          <PortalDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.portal.insight')}</p>
        </div>
      </section>

      {/* Step 04: Focus Trap */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>04</span>
          <h3 className={styles.stepTitle}>{t('steps.focusTrap.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.focusTrap.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.focusTrap.hint')}</p>
          <FocusTrapDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.focusTrap.insight')}</p>
        </div>
      </section>

      {/* Step 05: Animation */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>05</span>
          <h3 className={styles.stepTitle}>{t('steps.animation.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.animation.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.animation.hint')}</p>
          <AnimationDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.animation.insight')}</p>
        </div>
      </section>

      {/* Step 06: Native Dialog */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>06</span>
          <h3 className={styles.stepTitle}>{t('steps.nativeDialog.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.nativeDialog.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.nativeDialog.hint')}</p>
          <NativeDialogDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.nativeDialog.insight')}</p>
        </div>
      </section>

      {/* Step 07: Stacked Modals */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>07</span>
          <h3 className={styles.stepTitle}>{t('steps.stacked.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.stacked.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.stacked.hint')}</p>
          <StackedDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.stacked.insight')}</p>
        </div>
      </section>

      {/* Step 08: Keyboard */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>08</span>
          <h3 className={styles.stepTitle}>{t('steps.keyboard.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.keyboard.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.keyboard.hint')}</p>
          <KeyboardDemo />
        </div>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Tab</kbd>
            <span>{t('steps.keyboard.keys.tab')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Shift+Tab</kbd>
            <span>{t('steps.keyboard.keys.shiftTab')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Esc</kbd>
            <span>{t('steps.keyboard.keys.escape')}</span>
          </li>
        </ul>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.keyboard.insight')}</p>
        </div>
      </section>

      {/* Step 09: Accessibility */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>09</span>
          <h3 className={styles.stepTitle}>{t('steps.a11y.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.a11y.description')}</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('steps.a11y.headers.attribute')}</th>
              <th>{t('steps.a11y.headers.element')}</th>
              <th>{t('steps.a11y.headers.role')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>role=&quot;dialog&quot;</code></td>
              <td>{t('steps.a11y.modalContainer')}</td>
              <td>{t('steps.a11y.attrs.dialog')}</td>
            </tr>
            <tr>
              <td><code>aria-modal=&quot;true&quot;</code></td>
              <td>{t('steps.a11y.modalContainer')}</td>
              <td>{t('steps.a11y.attrs.modal')}</td>
            </tr>
            <tr>
              <td><code>aria-labelledby</code></td>
              <td>{t('steps.a11y.modalContainer')}</td>
              <td>{t('steps.a11y.attrs.labelledby')}</td>
            </tr>
            <tr>
              <td><code>aria-describedby</code></td>
              <td>{t('steps.a11y.modalContainer')}</td>
              <td>{t('steps.a11y.attrs.describedby')}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.a11y.insight')}</p>
        </div>
      </section>

      {/* API Reference */}
      <section className={styles.reference}>
        <h3 className={styles.referenceTitle}>{t('api.title')}</h3>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.root')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('api.headers.prop')}</th>
              <th>{t('api.headers.type')}</th>
              <th>{t('api.headers.default')}</th>
              <th>{t('api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>required</td>
              <td>{t('api.descriptions.children')}</td>
            </tr>
            <tr>
              <td><code>isOpen</code></td>
              <td><code>boolean</code></td>
              <td>-</td>
              <td>{t('api.descriptions.isOpen')}</td>
            </tr>
            <tr>
              <td><code>defaultOpen</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('api.descriptions.defaultOpen')}</td>
            </tr>
            <tr>
              <td><code>onClose</code></td>
              <td><code>{'() => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onClose')}</td>
            </tr>
            <tr>
              <td><code>closeOnOverlayClick</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>{t('api.descriptions.closeOnOverlayClick')}</td>
            </tr>
            <tr>
              <td><code>closeOnEsc</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>{t('api.descriptions.closeOnEsc')}</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td><code>number | string</code></td>
              <td><code>500</code></td>
              <td>{t('api.descriptions.width')}</td>
            </tr>
            <tr>
              <td><code>maxHeight</code></td>
              <td><code>string</code></td>
              <td><code>{"'80vh'"}</code></td>
              <td>{t('api.descriptions.maxHeight')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.trigger')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('api.headers.prop')}</th>
              <th>{t('api.headers.type')}</th>
              <th>{t('api.headers.default')}</th>
              <th>{t('api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactElement</code></td>
              <td>required</td>
              <td>{t('api.descriptions.triggerChildren')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.header')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('api.headers.prop')}</th>
              <th>{t('api.headers.type')}</th>
              <th>{t('api.headers.default')}</th>
              <th>{t('api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>required</td>
              <td>{t('api.descriptions.headerChildren')}</td>
            </tr>
            <tr>
              <td><code>showCloseButton</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>{t('api.descriptions.showCloseButton')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.body')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('api.headers.prop')}</th>
              <th>{t('api.headers.type')}</th>
              <th>{t('api.headers.default')}</th>
              <th>{t('api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>required</td>
              <td>{t('api.descriptions.bodyChildren')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.footer')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('api.headers.prop')}</th>
              <th>{t('api.headers.type')}</th>
              <th>{t('api.headers.default')}</th>
              <th>{t('api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>required</td>
              <td>{t('api.descriptions.footerChildren')}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
