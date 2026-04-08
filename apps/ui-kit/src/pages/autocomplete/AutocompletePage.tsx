import { useState, useCallback, useRef } from 'react';
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
      placeholder="Type to search fruits (async)..."
      debounceMs={300}
    />
  );
}

export default function AutocompletePage() {
  return (
    <div className={styles.page}>
      <header>
        <h2 className={styles.title}>Autocomplete</h2>
        <p className={styles.description}>
          A combobox component that filters and suggests items as the user types.
          Supports keyboard navigation, custom rendering, and async data fetching.
        </p>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Live Demo</h3>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>Basic — local filtering</p>
          <Autocomplete
            items={fruits}
            getItemLabel={(item) => item}
            placeholder="Search fruits..."
            debounceMs={0}
          />
        </div>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>Async — simulated API call (500ms delay)</p>
          <AsyncDemo />
        </div>

        <div className={styles.demo}>
          <p className={styles.demoLabel}>Custom rendering — countries with flags</p>
          <Autocomplete
            items={countries}
            getItemLabel={(item) => item.name}
            placeholder="Search countries..."
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
        <h3 className={styles.sectionTitle}>API Reference</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>items</code></td>
              <td><code>T[]</code></td>
              <td>required</td>
              <td>Array of items to filter</td>
            </tr>
            <tr>
              <td><code>getItemLabel</code></td>
              <td><code>(item: T) =&gt; string</code></td>
              <td>required</td>
              <td>Extracts display text from item</td>
            </tr>
            <tr>
              <td><code>onInputChange</code></td>
              <td><code>(value: string) =&gt; void</code></td>
              <td>-</td>
              <td>Called when input value changes (for async search)</td>
            </tr>
            <tr>
              <td><code>onSelect</code></td>
              <td><code>(item: T) =&gt; void</code></td>
              <td>-</td>
              <td>Called when an item is selected</td>
            </tr>
            <tr>
              <td><code>renderItem</code></td>
              <td><code>(item: T, highlighted: boolean) =&gt; ReactNode</code></td>
              <td>-</td>
              <td>Custom render function for each item</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Input placeholder text</td>
            </tr>
            <tr>
              <td><code>maxResults</code></td>
              <td><code>number</code></td>
              <td><code>10</code></td>
              <td>Maximum number of displayed results</td>
            </tr>
            <tr>
              <td><code>debounceMs</code></td>
              <td><code>number</code></td>
              <td><code>300</code></td>
              <td>Debounce delay in milliseconds</td>
            </tr>
            <tr>
              <td><code>noResultsMessage</code></td>
              <td><code>string</code></td>
              <td><code>"결과 없음"</code></td>
              <td>Message shown when no items match</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Shows loading indicator</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disables the input</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Accessibility</h3>
        <p>
          Follows the{' '}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">
            WAI-ARIA Combobox pattern
          </a>
          . WCAG 2.1 AA compliant.
        </p>
        <h4>Keyboard Navigation</h4>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↓</kbd> <span>Move to next option</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>↑</kbd> <span>Move to previous option</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Enter</kbd> <span>Select highlighted option</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Esc</kbd> <span>Close the listbox</span>
          </li>
        </ul>
        <h4>ARIA Attributes</h4>
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
              <td>Identifies the input as a combobox</td>
            </tr>
            <tr>
              <td><code>aria-expanded</code></td>
              <td>Input</td>
              <td>Indicates whether the listbox is open</td>
            </tr>
            <tr>
              <td><code>aria-activedescendant</code></td>
              <td>Input</td>
              <td>Points to the currently highlighted option</td>
            </tr>
            <tr>
              <td><code>role="listbox"</code></td>
              <td>List</td>
              <td>Identifies the suggestion list</td>
            </tr>
            <tr>
              <td><code>role="option"</code></td>
              <td>List item</td>
              <td>Identifies each suggestion</td>
            </tr>
            <tr>
              <td><code>aria-selected</code></td>
              <td>List item</td>
              <td>Indicates the highlighted option</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
