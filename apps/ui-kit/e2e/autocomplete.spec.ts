import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Autocomplete (ko)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/components/autocomplete');
  });

  test('page loads with Korean text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Autocomplete' })).toBeVisible();
    await expect(page.getByPlaceholder('과일 검색...')).toBeVisible();
  });

  test('basic demo: type and select with mouse', async ({ page }) => {
    const input = page.getByPlaceholder('과일 검색...');
    await input.fill('ap');

    const listbox = page.getByRole('listbox').first();
    await expect(listbox).toBeVisible();

    const option = page.getByRole('option', { name: 'Apple' });
    await expect(option).toBeVisible();
    await option.click();

    await expect(input).toHaveValue('Apple');
    await expect(listbox).not.toBeVisible();
  });

  test('keyboard-only flow: navigate and select', async ({ page }) => {
    const input = page.getByPlaceholder('과일 검색...');
    await input.fill('b');

    await expect(page.getByRole('listbox').first()).toBeVisible();

    await input.press('ArrowDown');
    await input.press('Enter');

    await expect(input).toHaveValue('Banana');
    await expect(page.getByRole('listbox').first()).not.toBeVisible();
  });

  test('Escape closes the listbox', async ({ page }) => {
    const input = page.getByPlaceholder('과일 검색...');
    await input.fill('ch');

    await expect(page.getByRole('listbox').first()).toBeVisible();

    await input.press('Escape');
    await expect(page.getByRole('listbox').first()).not.toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const input = page.getByPlaceholder('과일 검색...');
    await input.fill('ap');
    await expect(page.getByRole('listbox').first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Autocomplete (en)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/components/autocomplete');
  });

  test('page loads with English text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Autocomplete' })).toBeVisible();
    await expect(page.getByPlaceholder('Search fruits...')).toBeVisible();
  });

  test('basic demo: type and select', async ({ page }) => {
    const input = page.getByPlaceholder('Search fruits...');
    await input.fill('ap');

    const listbox = page.getByRole('listbox').first();
    await expect(listbox).toBeVisible();

    const option = page.getByRole('option', { name: 'Apple' });
    await expect(option).toBeVisible();
    await option.click();

    await expect(input).toHaveValue('Apple');
    await expect(listbox).not.toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const input = page.getByPlaceholder('Search fruits...');
    await input.fill('ap');
    await expect(page.getByRole('listbox').first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Language switching', () => {
  test('switches from ko to en via toggle', async ({ page }) => {
    await page.goto('/ko/components/autocomplete');
    await expect(page.getByPlaceholder('과일 검색...')).toBeVisible();

    await page.getByRole('link', { name: 'EN', exact: true }).click();

    await expect(page).toHaveURL(/\/en\/components\/autocomplete/);
    await expect(page.getByPlaceholder('Search fruits...')).toBeVisible();
  });

  test('switches from en to ko via toggle', async ({ page }) => {
    await page.goto('/en/components/autocomplete');
    await expect(page.getByPlaceholder('Search fruits...')).toBeVisible();

    await page.getByRole('link', { name: 'KO', exact: true }).click();

    await expect(page).toHaveURL(/\/ko\/components\/autocomplete/);
    await expect(page.getByPlaceholder('과일 검색...')).toBeVisible();
  });

  test('root redirects to /ko/components/autocomplete', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/ko\/components\/autocomplete/);
  });
});
