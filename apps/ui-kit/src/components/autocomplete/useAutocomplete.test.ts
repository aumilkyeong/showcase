import { renderHook, act } from '@testing-library/react';
import { useAutocomplete } from './useAutocomplete';

const items = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];
const getItemLabel = (item: string) => item;

function setup(overrides = {}) {
  return renderHook(() =>
    useAutocomplete({
      items,
      getItemLabel,
      maxResults: 10,
      debounceMs: 0,
      ...overrides,
    }),
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('initial state: closed, empty input, no highlighted item', () => {
  const { result } = setup();
  expect(result.current.isOpen).toBe(false);
  expect(result.current.inputValue).toBe('');
  expect(result.current.highlightedIndex).toBe(-1);
});

test('typing filters items and opens dropdown', () => {
  const { result } = setup();

  act(() => {
    result.current.handleInputChange('ap');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });

  expect(result.current.isOpen).toBe(true);
  expect(result.current.filteredItems).toEqual(['Apple', 'Apricot']);
});

test('ArrowDown moves highlight forward', () => {
  const { result } = setup();

  act(() => {
    result.current.handleInputChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.handleKeyDown({
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent);
  });

  expect(result.current.highlightedIndex).toBe(0);
});

test('ArrowUp moves highlight backward with wrap', () => {
  const { result } = setup();

  act(() => {
    result.current.handleInputChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.handleKeyDown({
      key: 'ArrowUp',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent);
  });

  expect(result.current.highlightedIndex).toBe(1);
});

test('Enter selects highlighted item', () => {
  const onSelect = vi.fn();
  const { result } = setup({ onSelect });

  act(() => {
    result.current.handleInputChange('ap');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.handleKeyDown({
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent);
  });
  act(() => {
    result.current.handleKeyDown({
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent);
  });

  expect(onSelect).toHaveBeenCalledWith('Apple');
  expect(result.current.inputValue).toBe('Apple');
  expect(result.current.isOpen).toBe(false);
});

test('Escape closes dropdown', () => {
  const { result } = setup();

  act(() => {
    result.current.handleInputChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.handleKeyDown({
      key: 'Escape',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent);
  });

  expect(result.current.isOpen).toBe(false);
});

test('selectItem closes dropdown and updates input', () => {
  const onSelect = vi.fn();
  const { result } = setup({ onSelect });

  act(() => {
    result.current.handleInputChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.selectItem('Apricot');
  });

  expect(onSelect).toHaveBeenCalledWith('Apricot');
  expect(result.current.inputValue).toBe('Apricot');
  expect(result.current.isOpen).toBe(false);
});

test('respects maxResults', () => {
  const { result } = setup({ maxResults: 2 });

  act(() => {
    result.current.handleInputChange('b');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });

  expect(result.current.filteredItems).toEqual(['Banana', 'Blueberry']);
});

test('calls onInputChange callback when provided', () => {
  const onInputChange = vi.fn();
  const { result } = setup({ onInputChange });

  act(() => {
    result.current.handleInputChange('test');
  });

  expect(onInputChange).toHaveBeenCalledWith('test');
});

test('empty input closes dropdown', () => {
  const { result } = setup();

  act(() => {
    result.current.handleInputChange('a');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });
  act(() => {
    result.current.handleInputChange('');
  });
  act(() => {
    vi.advanceTimersByTime(0);
  });

  expect(result.current.isOpen).toBe(false);
});
