import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from '@/components/dropdown-menu';
import styles from './DropdownMenuPage.module.css';

const fileActions = ['New File', 'Save', 'Export', 'Delete'];

function BasicDemo() {
  const { t } = useTranslation('dropdown-menu');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Button>File</DropdownMenu.Button>
        <DropdownMenu.List>
          {fileActions.map((action) => (
            <DropdownMenu.Item key={action} onClick={() => setSelected(action)}>
              {action}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.List>
      </DropdownMenu>
      {selected && (
        <p className={styles.selectedText}>
          {t('steps.basic.selected', { item: selected })}
        </p>
      )}
    </>
  );
}

function PatternDemo() {
  const { t } = useTranslation('dropdown-menu');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className={styles.patternRow}>
        <div className={styles.patternBox}>
          <p className={styles.patternLabel}>
            {t('steps.pattern.singleLabel')}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'label'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            <span className={styles.codeString}>{'"Actions"'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'items'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            {'{\u200B["New", "Save", "Delete"]}'}
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'onSelect'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            {'{handleSelect}'}
            {'\n'}
            {'  '}
            <span className={styles.codeProp}>{'disabledItems'}</span>
            <span className={styles.codeKeyword}>{'='}</span>
            {'{\u200B["Delete"]}'}
            {'\n'}
            <span className={styles.codeKeyword}>{'/>'}</span>
          </div>
        </div>
        <div className={styles.patternBox}>
          <p className={styles.patternLabel}>
            {t('steps.pattern.compoundLabel')}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>
              {'DropdownMenu.Button'}
            </span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            {'    Actions'}
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'</'}</span>
            <span className={styles.codeComponent}>
              {'DropdownMenu.Button'}
            </span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu.List'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            {'    '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu.Item'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'New'}
            <span className={styles.codeKeyword}>{'</\u2026>'}</span>
            {'\n'}
            {'    '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu.Item'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'Save'}
            <span className={styles.codeKeyword}>{'</\u2026>'}</span>
            {'\n'}
            {'    '}
            <span className={styles.codeKeyword}>{'<'}</span>
            <span className={styles.codeComponent}>
              {'DropdownMenu.Item'}
            </span>{' '}
            <span className={styles.codeProp}>{'disabled'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'Delete'}
            <span className={styles.codeKeyword}>{'</\u2026>'}</span>
            {'\n'}
            {'  '}
            <span className={styles.codeKeyword}>{'</'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu.List'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
            {'\n'}
            <span className={styles.codeKeyword}>{'</'}</span>
            <span className={styles.codeComponent}>{'DropdownMenu'}</span>
            <span className={styles.codeKeyword}>{'>'}</span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenu.Button>Actions</DropdownMenu.Button>
        <DropdownMenu.List>
          <DropdownMenu.Item onClick={() => setSelected('New')}>
            New
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setSelected('Save')}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
        </DropdownMenu.List>
      </DropdownMenu>
      {selected && (
        <p className={styles.selectedText}>
          {t('steps.pattern.selected', { item: selected })}
        </p>
      )}
    </>
  );
}

function StrategyDemo() {
  const { t } = useTranslation('dropdown-menu');

  return (
    <div className={styles.strategyRow}>
      <div className={styles.strategyBox}>
        <p className={styles.strategyLabel}>
          {t('steps.strategy.relativeLabel')}
        </p>
        <div className={styles.overflowContainer}>
          <span className={styles.overflowTag}>overflow: hidden</span>
          <DropdownMenu strategy="relative">
            <DropdownMenu.Button>Menu</DropdownMenu.Button>
            <DropdownMenu.List>
              {fileActions.map((action) => (
                <DropdownMenu.Item key={action}>{action}</DropdownMenu.Item>
              ))}
            </DropdownMenu.List>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.strategyBox}>
        <p className={styles.strategyLabel}>
          {t('steps.strategy.portalLabel')}
        </p>
        <div className={styles.overflowContainer}>
          <span className={styles.overflowTag}>overflow: hidden</span>
          <DropdownMenu strategy="portal">
            <DropdownMenu.Button>Menu</DropdownMenu.Button>
            <DropdownMenu.List>
              {fileActions.map((action) => (
                <DropdownMenu.Item key={action}>{action}</DropdownMenu.Item>
              ))}
            </DropdownMenu.List>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function KeyboardDemo() {
  const { t } = useTranslation('dropdown-menu');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Button>Edit</DropdownMenu.Button>
        <DropdownMenu.List>
          <DropdownMenu.Item onClick={() => setSelected('Undo')}>
            Undo
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setSelected('Redo')}>
            Redo
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>Cut</DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setSelected('Copy')}>
            Copy
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setSelected('Paste')}>
            Paste
          </DropdownMenu.Item>
        </DropdownMenu.List>
      </DropdownMenu>
      {selected && (
        <p className={styles.selectedText}>
          {t('steps.keyboard.selected', { item: selected })}
        </p>
      )}
    </>
  );
}

export default function DropdownMenuPage() {
  const { t } = useTranslation('dropdown-menu');

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
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.basic.hint')}</p>
          <BasicDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.basic.insight')}</p>
        </div>
      </section>

      {/* Step 02: Pattern */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>02</span>
          <h3 className={styles.stepTitle}>{t('steps.pattern.title')}</h3>
        </div>
        <p className={styles.stepDescription}>
          {t('steps.pattern.description')}
        </p>
        <div className={styles.demo} style={{ maxWidth: 640 }}>
          <p className={styles.hint}>{t('steps.pattern.hint')}</p>
          <PatternDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.pattern.insight')}</p>
        </div>
      </section>

      {/* Step 03: Strategy */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>03</span>
          <h3 className={styles.stepTitle}>{t('steps.strategy.title')}</h3>
        </div>
        <p className={styles.stepDescription}>
          {t('steps.strategy.description')}
        </p>
        <div className={styles.demo} style={{ maxWidth: 640 }}>
          <p className={styles.hint}>{t('steps.strategy.hint')}</p>
          <StrategyDemo />
        </div>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.strategy.insight')}</p>
        </div>
      </section>

      {/* Step 04: Keyboard */}
      <section className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>04</span>
          <h3 className={styles.stepTitle}>{t('steps.keyboard.title')}</h3>
        </div>
        <p className={styles.stepDescription}>
          {t('steps.keyboard.description')}
        </p>
        <div className={styles.demo}>
          <p className={styles.hint}>{t('steps.keyboard.hint')}</p>
          <KeyboardDemo />
        </div>
        <ul className={styles.kbdList}>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Enter</kbd>{' '}
            <span>{t('steps.keyboard.keys.enter')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Space</kbd>{' '}
            <span>{t('steps.keyboard.keys.space')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>{'\u2193'}</kbd>{' '}
            <span>{t('steps.keyboard.keys.down')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>{'\u2191'}</kbd>{' '}
            <span>{t('steps.keyboard.keys.up')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Home</kbd>{' '}
            <span>{t('steps.keyboard.keys.home')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>End</kbd>{' '}
            <span>{t('steps.keyboard.keys.end')}</span>
          </li>
          <li className={styles.kbdItem}>
            <kbd className={styles.kbd}>Esc</kbd>{' '}
            <span>{t('steps.keyboard.keys.escape')}</span>
          </li>
        </ul>
        <div className={styles.insight}>
          <span className={styles.insightLabel}>{t('insight')}</span>
          <p className={styles.insightText}>{t('steps.keyboard.insight')}</p>
        </div>
      </section>

      {/* Step 05: Accessibility */}
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
              <td>
                <code>aria-haspopup=&quot;menu&quot;</code>
              </td>
              <td>{t('steps.a11y.attrs.haspopup')}</td>
            </tr>
            <tr>
              <td>
                <code>aria-expanded</code>
              </td>
              <td>{t('steps.a11y.attrs.expanded')}</td>
            </tr>
            <tr>
              <td>
                <code>aria-controls</code>
              </td>
              <td>{t('steps.a11y.attrs.controls')}</td>
            </tr>
            <tr>
              <td>
                <code>role=&quot;menu&quot;</code>
              </td>
              <td>{t('steps.a11y.attrs.menu')}</td>
            </tr>
            <tr>
              <td>
                <code>role=&quot;menuitem&quot;</code>
              </td>
              <td>{t('steps.a11y.attrs.menuitem')}</td>
            </tr>
            <tr>
              <td>
                <code>aria-disabled</code>
              </td>
              <td>{t('steps.a11y.attrs.disabled')}</td>
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
              <td>
                <code>children</code>
              </td>
              <td>
                <code>ReactNode</code>
              </td>
              <td>required</td>
              <td>{t('api.descriptions.children')}</td>
            </tr>
            <tr>
              <td>
                <code>strategy</code>
              </td>
              <td>
                <code>{"'relative' | 'portal'"}</code>
              </td>
              <td>
                <code>{"'relative'"}</code>
              </td>
              <td>{t('api.descriptions.strategy')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.button')}</h4>
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
              <td>
                <code>children</code>
              </td>
              <td>
                <code>ReactNode</code>
              </td>
              <td>required</td>
              <td>{t('api.descriptions.buttonChildren')}</td>
            </tr>
            <tr>
              <td>
                <code>...rest</code>
              </td>
              <td>
                <code>ButtonHTMLAttributes</code>
              </td>
              <td>-</td>
              <td>{t('api.descriptions.buttonRest')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.list')}</h4>
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
              <td>
                <code>children</code>
              </td>
              <td>
                <code>ReactNode</code>
              </td>
              <td>required</td>
              <td>{t('api.descriptions.listChildren')}</td>
            </tr>
          </tbody>
        </table>

        <h4 className={styles.referenceSubtitle}>{t('api.sections.item')}</h4>
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
              <td>
                <code>children</code>
              </td>
              <td>
                <code>ReactNode</code>
              </td>
              <td>required</td>
              <td>{t('api.descriptions.itemChildren')}</td>
            </tr>
            <tr>
              <td>
                <code>onClick</code>
              </td>
              <td>
                <code>{'() => void'}</code>
              </td>
              <td>-</td>
              <td>{t('api.descriptions.onClick')}</td>
            </tr>
            <tr>
              <td>
                <code>disabled</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                <code>false</code>
              </td>
              <td>{t('api.descriptions.disabled')}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
