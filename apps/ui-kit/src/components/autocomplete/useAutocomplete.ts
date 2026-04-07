import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface UseAutocompleteOptions<T> {
  items: T[];
  getItemLabel: (item: T) => string;
  onInputChange?: (value: string) => void;
  onSelect?: (item: T) => void;
  maxResults?: number;
  debounceMs?: number;
}

export interface UseAutocompleteReturn<T> {
  inputValue: string;
  isOpen: boolean;
  highlightedIndex: number;
  filteredItems: T[];
  handleInputChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  selectItem: (item: T) => void;
  close: () => void;
}

export function useAutocomplete<T>({
  items,
  getItemLabel,
  onInputChange,
  onSelect,
  maxResults = 10,
  debounceMs = 300,
}: UseAutocompleteOptions<T>): UseAutocompleteReturn<T> {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedInput = useDebounce(inputValue, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedInput) return [];
    const query = debouncedInput.toLowerCase();
    return items
      .filter((item) => getItemLabel(item).toLowerCase().startsWith(query))
      .slice(0, maxResults);
  }, [debouncedInput, items, getItemLabel, maxResults]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setHighlightedIndex(-1);
      if (value) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      onInputChange?.(value);
    },
    [onInputChange],
  );

  const selectItem = useCallback(
    (item: T) => {
      setInputValue(getItemLabel(item));
      setIsOpen(false);
      setHighlightedIndex(-1);
      onSelect?.(item);
    },
    [getItemLabel, onSelect],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen && event.key !== 'ArrowDown') return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          setHighlightedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0,
          );
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1,
          );
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
            selectItem(filteredItems[highlightedIndex]);
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          close();
          break;
        }
      }
    },
    [isOpen, filteredItems, highlightedIndex, selectItem, close],
  );

  return {
    inputValue,
    isOpen,
    highlightedIndex,
    filteredItems,
    handleInputChange,
    handleKeyDown,
    selectItem,
    close,
  };
}
