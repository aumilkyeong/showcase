import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { Autocomplete } from './Autocomplete';

const items = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];
const getItemLabel = (item: string) => item;

function setup(overrides = {}) {
  const user = userEvent.setup();
  const result = render(
    <Autocomplete
      items={items}
      getItemLabel={getItemLabel}
      debounceMs={0}
      {...overrides}
    />,
  );
  return { user, ...result };
}

test('renders combobox input', () => {
  setup();
  expect(screen.getByRole('combobox')).toBeInTheDocument();
});

test('opens listbox with filtered results on typing', async () => {
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');

  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  expect(screen.getAllByRole('option')).toHaveLength(2);
  expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument();
});

test('selects item on click', async () => {
  const onSelect = vi.fn();
  const { user } = setup({ onSelect });
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  await user.click(screen.getByRole('option', { name: 'Apple' }));

  expect(onSelect).toHaveBeenCalledWith('Apple');
  expect(input).toHaveValue('Apple');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('keyboard navigation: ArrowDown, Enter to select', async () => {
  const onSelect = vi.fn();
  const { user } = setup({ onSelect });
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  await user.keyboard('{ArrowDown}{Enter}');

  expect(onSelect).toHaveBeenCalledWith('Apple');
});

test('Escape closes the listbox', async () => {
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('aria-expanded reflects open state', async () => {
  const { user } = setup();
  const input = screen.getByRole('combobox');

  expect(input).toHaveAttribute('aria-expanded', 'false');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});

test('aria-activedescendant updates on keyboard navigation', async () => {
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
  await user.keyboard('{ArrowDown}');

  const options = screen.getAllByRole('option');
  expect(input).toHaveAttribute('aria-activedescendant', options[0].id);
});

test('shows noResultsMessage when no matches', async () => {
  const { user } = setup({ noResultsMessage: 'No results' });
  const input = screen.getByRole('combobox');

  await user.type(input, 'xyz');
  await waitFor(() => {
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

test('renders nothing when disabled', async () => {
  const { user } = setup({ disabled: true });
  const input = screen.getByRole('combobox');

  expect(input).toBeDisabled();
  await user.type(input, 'ap');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('shows loading indicator when loading is true', async () => {
  const { user } = setup({ loading: true });
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

test('shows translated noResults message in English', async () => {
  await i18n.changeLanguage('en');
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'xyz');
  await waitFor(() => {
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

test('shows translated noResults message in Korean', async () => {
  await i18n.changeLanguage('ko');
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'xyz');
  await waitFor(() => {
    expect(screen.getByText('결과 없음')).toBeInTheDocument();
  });
});

test('shows translated loading text', async () => {
  await i18n.changeLanguage('en');
  const { user } = setup({ loading: true });
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');
  await waitFor(() => {
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

test('props override i18n default for noResultsMessage', async () => {
  await i18n.changeLanguage('en');
  const { user } = setup({ noResultsMessage: 'Custom empty' });
  const input = screen.getByRole('combobox');

  await user.type(input, 'xyz');
  await waitFor(() => {
    expect(screen.getByText('Custom empty')).toBeInTheDocument();
  });
});

test('announces result count to screen readers', async () => {
  await i18n.changeLanguage('en');
  const { user } = setup();
  const input = screen.getByRole('combobox');

  await user.type(input, 'ap');

  await waitFor(() => {
    const liveRegion = screen.getByRole('log');
    expect(liveRegion).toHaveTextContent('2 results');
  });
});
