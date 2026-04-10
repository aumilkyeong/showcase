import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageCarousel } from '@/components/image-carousel';
import styles from './ImageCarouselPage.module.css';

const demoImages = [
  { src: 'https://picsum.photos/id/10/600/400', alt: 'Forest' },
  { src: 'https://picsum.photos/id/20/600/400', alt: 'Mountain path' },
  { src: 'https://picsum.photos/id/30/600/400', alt: 'Misty valley' },
  { src: 'https://picsum.photos/id/40/600/400', alt: 'Ocean cliff' },
  { src: 'https://picsum.photos/id/50/600/400', alt: 'Sunrise' },
];

/* ─── Step 01: Basic ─── */

function BasicDemo() {
  const [loop, setLoop] = useState(true);

  return (
    <>
      <ImageCarousel images={demoImages} width={480} height={320} loop={loop}>
        <ImageCarousel.Prev />
        <ImageCarousel.Viewport />
        <ImageCarousel.Next />
        <ImageCarousel.Dots />
      </ImageCarousel>
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${loop ? styles.toggleSwitchOn : ''}`}
            onClick={() => setLoop(!loop)}
            aria-pressed={loop}
          />
          Loop
        </label>
      </div>
    </>
  );
}

/* ─── Step 02: Flux ─── */

function FluxDemo() {
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (action: string) => {
    setLog((prev) => [...prev.slice(-19), `${new Date().toLocaleTimeString()} → ${action}`]);
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <>
      <ImageCarousel
        images={demoImages}
        width={480}
        height={320}
        onPrevClick={() => addLog('PREV_IMAGE (button)')}
        onNextClick={() => addLog('NEXT_IMAGE (button)')}
        onPageSelect={(i) => addLog(`SHOW_IMAGE → index: ${i}`)}
      >
        <ImageCarousel.Prev />
        <ImageCarousel.Viewport />
        <ImageCarousel.Next />
        <ImageCarousel.Dots />
      </ImageCarousel>
      <div ref={logRef} className={styles.actionLog}>
        {log.length === 0 ? (
          <span>Waiting for actions...</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} className={styles.actionLogEntry}>{entry}</div>
          ))
        )}
      </div>
    </>
  );
}

/* ─── Step 03: Autoplay ─── */

function AutoplayDemo() {
  const [autoplay, setAutoplay] = useState(false);
  const [delay, setDelay] = useState(3000);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!autoplay) {
      setProgress(0);
      progressRef.current = 0;
      return;
    }

    lastTickRef.current = performance.now();
    progressRef.current = 0;

    const animate = (now: number) => {
      const elapsed = now - lastTickRef.current;
      progressRef.current += elapsed;
      lastTickRef.current = now;

      const pct = Math.min((progressRef.current / delay) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        progressRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoplay, delay]);

  return (
    <>
      <ImageCarousel
        images={demoImages}
        width={480}
        height={320}
        autoplay={autoplay}
        delay={delay}
        onPageSelect={() => { progressRef.current = 0; }}
      >
        <ImageCarousel.Prev />
        <ImageCarousel.Viewport />
        <ImageCarousel.Next />
        <ImageCarousel.Dots />
      </ImageCarousel>
      <div className={styles.timerBar}>
        <div className={styles.timerProgress} style={{ width: `${autoplay ? progress : 0}%` }} />
      </div>
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${autoplay ? styles.toggleSwitchOn : ''}`}
            onClick={() => setAutoplay(!autoplay)}
            aria-pressed={autoplay}
          />
          Autoplay
        </label>
        <div className={styles.slider}>
          <span>{(delay / 1000).toFixed(1)}s</span>
          <input
            type="range"
            className={styles.sliderInput}
            min={1000}
            max={10000}
            step={500}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Step 04: Performance ─── */

function PerformanceDemo() {
  const { t } = useTranslation('image-carousel');
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set([0]));
  const [preloadingSet, setPreloadingSet] = useState<Set<number>>(new Set());

  const manyImages = Array.from({ length: 10 }, (_, i) => ({
    src: `https://picsum.photos/id/${(i + 1) * 10}/600/400`,
    alt: `Image ${i + 1}`,
  }));

  const handlePageSelect = (index: number) => {
    setLoadedSet((prev) => new Set([...prev, index]));

    const nextPreloading = new Set<number>();
    for (let i = 1; i <= 3; i++) {
      const idx = (index + i) % manyImages.length;
      if (!loadedSet.has(idx)) {
        nextPreloading.add(idx);
      }
    }
    setPreloadingSet(nextPreloading);

    setTimeout(() => {
      setLoadedSet((prev) => {
        const next = new Set(prev);
        nextPreloading.forEach((idx) => next.add(idx));
        return next;
      });
      setPreloadingSet(new Set());
    }, 600);
  };

  const getSegmentClass = (i: number) => {
    if (loadedSet.has(i)) return `${styles.loadingSegment} ${styles.loadingSegmentLoaded}`;
    if (preloadingSet.has(i)) return `${styles.loadingSegment} ${styles.loadingSegmentPreloading}`;
    return styles.loadingSegment;
  };

  return (
    <>
      <ImageCarousel
        images={manyImages}
        width={480}
        height={320}
        onPageSelect={handlePageSelect}
      >
        <ImageCarousel.Prev />
        <ImageCarousel.Viewport />
        <ImageCarousel.Next />
        <ImageCarousel.Dots />
      </ImageCarousel>
      <div className={styles.loadingBar}>
        {manyImages.map((_, i) => (
          <div key={i} className={getSegmentClass(i)} />
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#3d3a39' }} />
          {t('steps.performance.legend.notLoaded')}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#ffba00' }} />
          {t('steps.performance.legend.preloading')}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#00d992' }} />
          {t('steps.performance.legend.loaded')}
        </span>
      </div>
    </>
  );
}

/* ─── Step 05: Responsive ─── */

function ResponsiveDemo() {
  const responsiveImages = demoImages.map((img) => ({
    ...img,
    srcSet: `${img.src} 600w, ${img.src.replace('/600/400', '/300/200')} 300w, ${img.src.replace('/600/400', '/1200/800')} 1200w`,
  }));

  return (
    <ImageCarousel images={responsiveImages} width={480} height={320}>
      <ImageCarousel.Prev />
      <ImageCarousel.Viewport />
      <ImageCarousel.Next />
      <ImageCarousel.Dots />
    </ImageCarousel>
  );
}

/* ─── Step 06: Keyboard ─── */

function KeyboardDemo() {
  return (
    <ImageCarousel images={demoImages} width={480} height={320}>
      <ImageCarousel.Prev />
      <ImageCarousel.Viewport />
      <ImageCarousel.Next />
      <ImageCarousel.Dots />
    </ImageCarousel>
  );
}

/* ─── Page ─── */

export default function ImageCarouselPage() {
  const { t } = useTranslation('image-carousel');

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.overline}>{t('hero.overline')}</p>
        <h2 className={styles.title}>{t('hero.title')}</h2>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
      </header>

      {/* Step 01: Basic */}
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

      {/* Step 02: Flux */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>02</span>
          <h3 className={styles.stepTitle}>{t('steps.flux.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.flux.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.flux.hint')}</p>
          <FluxDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.flux.insight')}</p>
        </div>
      </section>

      {/* Step 03: Autoplay */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>03</span>
          <h3 className={styles.stepTitle}>{t('steps.autoplay.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.autoplay.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.autoplay.hint')}</p>
          <AutoplayDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.autoplay.insight')}</p>
        </div>
      </section>

      {/* Step 04: Performance */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>04</span>
          <h3 className={styles.stepTitle}>{t('steps.performance.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.performance.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.performance.hint')}</p>
          <PerformanceDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.performance.insight')}</p>
        </div>
      </section>

      {/* Step 05: Responsive */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>05</span>
          <h3 className={styles.stepTitle}>{t('steps.responsive.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.responsive.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.responsive.hint')}</p>
          <ResponsiveDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.responsive.insight')}</p>
        </div>
      </section>

      {/* Step 06: Keyboard */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>06</span>
          <h3 className={styles.stepTitle}>{t('steps.keyboard.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.keyboard.description')}</p>
        <div className={styles.demo} style={{ maxWidth: 540 }}>
          <p className={styles.hint}>{t('steps.keyboard.hint')}</p>
          <KeyboardDemo />
        </div>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>{'\u2190'}</kbd>
            <span>{t('steps.keyboard.keys.left')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>{'\u2192'}</kbd>
            <span>{t('steps.keyboard.keys.right')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Home</kbd>
            <span>{t('steps.keyboard.keys.home')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>End</kbd>
            <span>{t('steps.keyboard.keys.end')}</span>
          </li>
        </ul>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.keyboard.insight')}</p>
        </div>
      </section>

      {/* Step 07: Accessibility */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>07</span>
          <h3 className={styles.stepTitle}>{t('steps.a11y.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.a11y.description')}</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('steps.a11y.headers.element')}</th>
              <th>{t('steps.a11y.headers.attribute')}</th>
              <th>{t('steps.a11y.headers.role')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Root</td>
              <td><code>role=&quot;region&quot;</code></td>
              <td>{t('steps.a11y.attrs.regionRole')}</td>
            </tr>
            <tr>
              <td>Root</td>
              <td><code>aria-roledescription=&quot;carousel&quot;</code></td>
              <td>{t('steps.a11y.attrs.carouselRoledescription')}</td>
            </tr>
            <tr>
              <td>Viewport</td>
              <td><code>aria-live=&quot;polite&quot;</code></td>
              <td>{t('steps.a11y.attrs.ariaLive')}</td>
            </tr>
            <tr>
              <td>Slide</td>
              <td><code>role=&quot;group&quot;</code></td>
              <td>{t('steps.a11y.attrs.slideRole')}</td>
            </tr>
            <tr>
              <td>Slide</td>
              <td><code>aria-roledescription=&quot;slide&quot;</code></td>
              <td>{t('steps.a11y.attrs.slideRoledescription')}</td>
            </tr>
            <tr>
              <td>Slide</td>
              <td><code>aria-label=&quot;N of M&quot;</code></td>
              <td>{t('steps.a11y.attrs.slideLabel')}</td>
            </tr>
            <tr>
              <td>Dots</td>
              <td><code>role=&quot;tablist&quot;</code></td>
              <td>{t('steps.a11y.attrs.tablist')}</td>
            </tr>
            <tr>
              <td>Dot</td>
              <td><code>aria-selected</code></td>
              <td>{t('steps.a11y.attrs.tabSelected')}</td>
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
              <td><code>images</code></td>
              <td><code>{'ImageData[]'}</code></td>
              <td>required</td>
              <td>{t('api.descriptions.images')}</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td><code>number</code></td>
              <td><code>600</code></td>
              <td>{t('api.descriptions.width')}</td>
            </tr>
            <tr>
              <td><code>height</code></td>
              <td><code>number</code></td>
              <td><code>400</code></td>
              <td>{t('api.descriptions.height')}</td>
            </tr>
            <tr>
              <td><code>loop</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>{t('api.descriptions.loop')}</td>
            </tr>
            <tr>
              <td><code>autoplay</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('api.descriptions.autoplay')}</td>
            </tr>
            <tr>
              <td><code>delay</code></td>
              <td><code>number</code></td>
              <td><code>3000</code></td>
              <td>{t('api.descriptions.delay')}</td>
            </tr>
            <tr>
              <td><code>onLoad</code></td>
              <td><code>{'() => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onLoad')}</td>
            </tr>
            <tr>
              <td><code>onPageSelect</code></td>
              <td><code>{'(index: number) => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onPageSelect')}</td>
            </tr>
            <tr>
              <td><code>onPrevClick</code></td>
              <td><code>{'() => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onPrevClick')}</td>
            </tr>
            <tr>
              <td><code>onNextClick</code></td>
              <td><code>{'() => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onNextClick')}</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>required</td>
              <td>{t('api.descriptions.children')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.prev')}</h4>
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
              <td><code>aria-label</code></td>
              <td><code>string</code></td>
              <td><code>{'"이전 이미지"'}</code></td>
              <td>{t('api.descriptions.ariaLabelPrev')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.next')}</h4>
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
              <td><code>aria-label</code></td>
              <td><code>string</code></td>
              <td><code>{'"다음 이미지"'}</code></td>
              <td>{t('api.descriptions.ariaLabelNext')}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
