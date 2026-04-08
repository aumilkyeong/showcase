import { useRef, useId, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutocomplete } from './useAutocomplete';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './Autocomplete.module.css';

export interface AutocompleteProps<T> {
  items: T[];
  getItemLabel: (item: T) => string;
  onInputChange?: (value: string) => void;
  onSelect?: (item: T) => void;
  renderItem?: (item: T, highlighted: boolean) => ReactNode;
  placeholder?: string;
  maxResults?: number;
  debounceMs?: number;
  noResultsMessage?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function Autocomplete<T>({
  items,
  getItemLabel,
  onInputChange,
  onSelect,
  renderItem,
  placeholder,
  maxResults = 10,
  debounceMs = 300,
  noResultsMessage,
  loading = false,
  disabled = false,
}: AutocompleteProps<T>) {
  const { t } = useTranslation('autocomplete');
  const id = useId();
  const listboxId = `${id}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    inputValue,
    isOpen,
    highlightedIndex,
    filteredItems,
    handleInputChange,
    handleKeyDown,
    selectItem,
    close,
  } = useAutocomplete({
    items,
    getItemLabel,
    onInputChange,
    onSelect,
    maxResults,
    debounceMs,
  });

  useClickOutside(containerRef, close);

  const showListbox = isOpen && !disabled;
  const showNoResults = showListbox && !loading && filteredItems.length === 0 && inputValue.length > 0;
  const resolvedNoResults = noResultsMessage ?? t('component.noResults');

  function getOptionId(index: number) {
    return `${id}-option-${index}`;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={showListbox}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={showListbox ? listboxId : undefined}
        aria-activedescendant={
          showListbox && highlightedIndex >= 0
            ? getOptionId(highlightedIndex)
            : undefined
        }
        className={styles.input}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {showListbox && (
        <ul id={listboxId} role="listbox" className={styles.listbox}>
          {loading ? (
            <li role="status" className={styles.loading}>
              {t('component.loading')}
            </li>
          ) : showNoResults ? (
            <li className={styles.noResults}>{resolvedNoResults}</li>
          ) : (
            filteredItems.map((item, index) => (
              <li
                key={getItemLabel(item)}
                id={getOptionId(index)}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`${styles.option} ${index === highlightedIndex ? styles.optionHighlighted : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(item);
                  inputRef.current?.focus();
                }}
              >
                {renderItem
                  ? renderItem(item, index === highlightedIndex)
                  : getItemLabel(item)}
              </li>
            ))
          )}
        </ul>
      )}

      <div role="log" aria-live="polite" className={styles.srOnly}>
        {showListbox && !loading && filteredItems.length > 0
          ? t('component.resultCount', { count: filteredItems.length })
          : ''}
      </div>
    </div>
  );
}
