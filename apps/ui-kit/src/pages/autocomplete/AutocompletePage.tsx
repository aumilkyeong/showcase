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
      placeholder={t('page.demo.asyncPlaceholder')}
      debounceMs={300}
    />
  );
}

export default function AutocompletePage() {
  const { t } = useTranslation('autocomplete');

  return (
    <div className={styles.page}>
      <header>
        <h2 className={styles.title}>{t('page.title')}</h2>
        <p className={styles.description}>{t('page.description')}</p>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('page.demo.sectionTitle')}</h3>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>{t('page.demo.basic')}</p>
          <Autocomplete
            items={fruits}
            getItemLabel={(item) => item}
            placeholder={t('page.demo.basicPlaceholder')}
            debounceMs={0}
          />
        </div>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>{t('page.demo.async')}</p>
          <AsyncDemo />
        </div>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>{t('page.demo.custom')}</p>
          <Autocomplete
            items={countries}
            getItemLabel={(item) => item.name}
            placeholder={t('page.demo.customPlaceholder')}
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
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('page.api.sectionTitle')}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('page.api.headers.prop')}</th>
              <th>{t('page.api.headers.type')}</th>
              <th>{t('page.api.headers.default')}</th>
              <th>{t('page.api.headers.description')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>items</code></td>
              <td><code>T[]</code></td>
              <td>required</td>
              <td>{t('page.api.descriptions.items')}</td>
            </tr>
            <tr>
              <td><code>getItemLabel</code></td>
              <td><code>{'(item: T) => string'}</code></td>
              <td>required</td>
              <td>{t('page.api.descriptions.getItemLabel')}</td>
            </tr>
            <tr>
              <td><code>onInputChange</code></td>
              <td><code>{'(value: string) => void'}</code></td>
              <td>-</td>
              <td>{t('page.api.descriptions.onInputChange')}</td>
            </tr>
            <tr>
              <td><code>onSelect</code></td>
              <td><code>{'(item: T) => void'}</code></td>
              <td>-</td>
              <td>{t('page.api.descriptions.onSelect')}</td>
            </tr>
            <tr>
              <td><code>renderItem</code></td>
              <td><code>{'(item: T, highlighted: boolean) => ReactNode'}</code></td>
              <td>-</td>
              <td>{t('page.api.descriptions.renderItem')}</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>{t('page.api.descriptions.placeholder')}</td>
            </tr>
            <tr>
              <td><code>maxResults</code></td>
              <td><code>number</code></td>
              <td><code>10</code></td>
              <td>{t('page.api.descriptions.maxResults')}</td>
            </tr>
            <tr>
              <td><code>debounceMs</code></td>
              <td><code>number</code></td>
              <td><code>300</code></td>
              <td>{t('page.api.descriptions.debounceMs')}</td>
            </tr>
            <tr>
              <td><code>noResultsMessage</code></td>
              <td><code>string</code></td>
              <td><code>{`"${t('component.noResults')}"`}</code></td>
              <td>{t('page.api.descriptions.noResultsMessage')}</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('page.api.descriptions.loading')}</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>{t('page.api.descriptions.disabled')}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('page.a11y.sectionTitle')}</h3>
        <p>
          {t('page.a11y.description')}
        </p>
        <h4>{t('page.a11y.keyboard')}</h4>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↓</kbd> <span>{t('page.a11y.keys.down')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↑</kbd> <span>{t('page.a11y.keys.up')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Enter</kbd> <span>{t('page.a11y.keys.enter')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Esc</kbd> <span>{t('page.a11y.keys.escape')}</span>
          </li>
        </ul>
        <h4>{t('page.a11y.ariaAttributes')}</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Element</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>role="combobox"</code></td>
              <td>Input</td>
              <td>{t('page.a11y.aria.combobox')}</td>
            </tr>
            <tr>
              <td><code>aria-expanded</code></td>
              <td>Input</td>
              <td>{t('page.a11y.aria.expanded')}</td>
            </tr>
            <tr>
              <td><code>aria-activedescendant</code></td>
              <td>Input</td>
              <td>{t('page.a11y.aria.activedescendant')}</td>
            </tr>
            <tr>
              <td><code>role="listbox"</code></td>
              <td>List</td>
              <td>{t('page.a11y.aria.listbox')}</td>
            </tr>
            <tr>
              <td><code>role="option"</code></td>
              <td>List item</td>
              <td>{t('page.a11y.aria.option')}</td>
            </tr>
            <tr>
              <td><code>aria-selected</code></td>
              <td>List item</td>
              <td>{t('page.a11y.aria.selected')}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
