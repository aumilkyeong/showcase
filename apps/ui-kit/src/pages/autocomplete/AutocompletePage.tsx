import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@/components/autocomplete';
import styles from './AutocompletePage.module.css';

const fruits = [
  'Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry',
  'Cranberry', 'Grape', 'Kiwi', 'Lemon', 'Mango',
  'Orange', 'Peach', 'Pear', 'Pineapple', 'Strawberry',
];

interface Country {
  name: string;
  emoji: string;
}

const countries: Country[] = [
  { name: 'South Korea', emoji: '\uD83C\uDDF0\uD83C\uDDF7' },
  { name: 'Japan', emoji: '\uD83C\uDDEF\uD83C\uDDF5' },
  { name: 'United States', emoji: '\uD83C\uDDFA\uD83C\uDDF8' },
  { name: 'United Kingdom', emoji: '\uD83C\uDDEC\uD83C\uDDE7' },
  { name: 'Germany', emoji: '\uD83C\uDDE9\uD83C\uDDEA' },
  { name: 'France', emoji: '\uD83C\uDDEB\uD83C\uDDF7' },
  { name: 'Canada', emoji: '\uD83C\uDDE8\uD83C\uDDE6' },
  { name: 'Australia', emoji: '\uD83C\uDDE6\uD83C\uDDFA' },
];

function AsyncDemo() {
  const { t } = useTranslation('autocomplete');
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleInputChange = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const query = value.toLowerCase();
      setItems(fruits.filter((f) => f.toLowerCase().startsWith(query)));
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Autocomplete
      items={items}
      getItemLabel={(item) => item}
      onInputChange={handleInputChange}
      loading={loading}
      placeholder={t('steps.async.placeholder')}
      debounceMs={300}
    />
  );
}

export default function AutocompletePage() {
  const { t } = useTranslation('autocomplete');

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.overline}>{t('hero.overline')}</p>
        <h2 className={styles.title}>{t('hero.title')}</h2>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
      </header>

      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>01</span>
          <h3 className={styles.stepTitle}>{t('steps.basic.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.basic.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.basic.hint')}</p>
          <Autocomplete
            items={fruits}
            getItemLabel={(item) => item}
            placeholder={t('steps.basic.placeholder')}
            debounceMs={0}
          />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.basic.insight')}</p>
        </div>
      </section>

      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>02</span>
          <h3 className={styles.stepTitle}>{t('steps.async.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.async.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.async.hint')}</p>
          <AsyncDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.async.insight')}</p>
        </div>
      </section>

      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>03</span>
          <h3 className={styles.stepTitle}>{t('steps.custom.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.custom.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.custom.hint')}</p>
          <Autocomplete
            items={countries}
            getItemLabel={(item) => item.name}
            placeholder={t('steps.custom.placeholder')}
            debounceMs={0}
            renderItem={(item, highlighted) => (
              <div
                className={styles.richItem}
                style={{ fontWeight: highlighted ? 600 : 400 }}
              >
                <span className={styles.richItemEmoji}>{item.emoji}</span>
                <span>{item.name}</span>
              </div>
            )}
          />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.custom.insight')}</p>
        </div>
      </section>

      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>04</span>
          <h3 className={styles.stepTitle}>{t('steps.keyboard.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.keyboard.description')}</p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.keyboard.hint')}</p>
          <Autocomplete
            items={fruits}
            getItemLabel={(item) => item}
            placeholder={t('steps.keyboard.placeholder')}
            debounceMs={0}
          />
        </div>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↓</kbd> <span>{t('steps.keyboard.keys.down')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↑</kbd> <span>{t('steps.keyboard.keys.up')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Enter</kbd> <span>{t('steps.keyboard.keys.enter')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Esc</kbd> <span>{t('steps.keyboard.keys.escape')}</span>
          </li>
        </ul>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.keyboard.insight')}</p>
        </div>
      </section>

      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>05</span>
          <h3 className={styles.stepTitle}>{t('steps.a11y.title')}</h3>
        </div>
        <p className={styles.stepDescription}>{t('steps.a11y.description')}</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('steps.a11y.headers.attribute')}</th>
              <th>{t('steps.a11y.headers.role')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>role=&quot;combobox&quot;</code></td>
              <td>{t('steps.a11y.attrs.combobox')}</td>
            </tr>
            <tr>
              <td><code>aria-expanded</code></td>
              <td>{t('steps.a11y.attrs.expanded')}</td>
            </tr>
            <tr>
              <td><code>aria-activedescendant</code></td>
              <td>{t('steps.a11y.attrs.activedescendant')}</td>
            </tr>
            <tr>
              <td><code>role=&quot;listbox&quot;</code> / <code>role=&quot;option&quot;</code></td>
              <td>{t('steps.a11y.attrs.listbox')}</td>
            </tr>
            <tr>
              <td><code>aria-selected</code></td>
              <td>{t('steps.a11y.attrs.selected')}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.a11y.insight')}</p>
        </div>
      </section>

      <section className={styles.reference}>
        <h3 className={styles.referenceTitle}>{t('api.title')}</h3>
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
              <td><code>items</code></td>
              <td><code>T[]</code></td>
              <td>required</td>
              <td>{t('api.descriptions.items')}</td>
            </tr>
            <tr>
              <td><code>getItemLabel</code></td>
              <td><code>{'(item: T) => string'}</code></td>
              <td>required</td>
              <td>{t('api.descriptions.getItemLabel')}</td>
            </tr>
            <tr>
              <td><code>onInputChange</code></td>
              <td><code>{'(value: string) => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onInputChange')}</td>
            </tr>
            <tr>
              <td><code>onSelect</code></td>
              <td><code>{'(item: T) => void'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.onSelect')}</td>
            </tr>
            <tr>
              <td><code>renderItem</code></td>
              <td><code>{'(item: T, highlighted: boolean) => ReactNode'}</code></td>
              <td>-</td>
              <td>{t('api.descriptions.renderItem')}</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>{t('api.descriptions.placeholder')}</td>
            </tr>
            <tr>
              <td><code>maxResults</code></td>
              <td><code>number</code></td>
              <td><code>10</code></td>
              <td>{t('api.descriptions.maxResults')}</td>
            </tr>
            <tr>
              <td><code>debounceMs</code></td>
              <td><code>number</code></td>
              <td><code>300</code></td>
              <td>{t('api.descriptions.debounceMs')}</td>
            </tr>
            <tr>
              <td><code>noResultsMessage</code></td>
              <td><code>string</code></td>
              <td><code>{`"${t('component.noResults')}"`}</code></td>
              <td>{t('api.descriptions.noResultsMessage')}</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('api.descriptions.loading')}</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('api.descriptions.disabled')}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
