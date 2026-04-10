import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dropdown Menu (ko)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/components/dropdown-menu');
  });

  test('page loads with Korean text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dropdown Menu' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Actions' }).first(),
    ).toBeVisible();
  });

  test('basic demo: click to open, select item', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.click();
    const menu = page.getByRole('menu').first();
    await expect(menu).toBeVisible();
    await page.getByRole('menuitem', { name: 'New File' }).click();
    await expect(menu).not.toBeVisible();
    await expect(page.getByText('선택됨: New File')).toBeVisible();
  });

  test('keyboard-only flow: open, navigate, select', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.focus();
    await button.press('Enter');
    await expect(page.getByRole('menu').first()).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByText('선택됨: Save')).toBeVisible();
  });

  test('Escape closes the menu', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.click();
    await expect(page.getByRole('menu').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu').first()).not.toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.click();
    await expect(page.getByRole('menu').first()).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Dropdown Menu (en)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/components/dropdown-menu');
  });

  test('page loads with English text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dropdown Menu' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Actions' }).first(),
    ).toBeVisible();
  });

  test('basic demo: select item shows English text', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.click();
    await page.getByRole('menuitem', { name: 'New File' }).click();
    await expect(page.getByText('Selected: New File')).toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Actions' }).first();
    await button.click();
    await expect(page.getByRole('menu').first()).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Language switching (dropdown-menu)', () => {
  test('switches from ko to en', async ({ page }) => {
    await page.goto('/ko/components/dropdown-menu');
    await expect(page.getByText('버튼을 누르고')).toBeVisible();
    await page.getByRole('link', { name: 'EN' }).click();
    await expect(page).toHaveURL(/\/en\/components\/dropdown-menu/);
    await expect(page.getByText('Click the button')).toBeVisible();
  });

  test('switches from en to ko', async ({ page }) => {
    await page.goto('/en/components/dropdown-menu');
    await expect(page.getByText('Click the button')).toBeVisible();
    await page.getByRole('link', { name: 'KO' }).click();
    await expect(page).toHaveURL(/\/ko\/components\/dropdown-menu/);
    await expect(page.getByText('버튼을 누르고')).toBeVisible();
  });
});
