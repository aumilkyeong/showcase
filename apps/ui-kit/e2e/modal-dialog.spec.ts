import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Modal Dialog (ko)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/components/modal-dialog');
  });

  test('page loads with Korean text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Modal Dialog' }),
    ).toBeVisible();
  });

  test('controlled modal: open and close', async ({ page }) => {
    await page.getByRole('button', { name: '모달 열기 (제어)' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: '닫기' }).first().click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('ESC closes modal', async ({ page }) => {
    await page.getByRole('button', { name: '모달 열기 (제어)' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('stacked modals: ESC closes only topmost', async ({ page }) => {
    await page.getByRole('button', { name: '첫 번째 모달 열기' }).click();
    await expect(page.getByText('모달 1단계')).toBeVisible();
    await page.getByRole('button', { name: '다음 모달 열기' }).first().click();
    await expect(page.getByText('모달 2단계')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText('모달 2단계')).not.toBeVisible();
    await expect(page.getByText('모달 1단계')).toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    await page.getByRole('button', { name: '모달 열기 (제어)' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Modal Dialog (en)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/components/modal-dialog');
  });

  test('page loads with English text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Modal Dialog' }),
    ).toBeVisible();
  });

  test('controlled modal works in English', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Modal (Controlled)' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).first().click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Modal (Controlled)' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Language switching (modal-dialog)', () => {
  test('switches from ko to en', async ({ page }) => {
    await page.goto('/ko/components/modal-dialog');
    await expect(page.getByText('모달을 열고 닫으며')).toBeVisible();
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/components\/modal-dialog/);
    await expect(page.getByText('Open and close modals')).toBeVisible();
  });

  test('switches from en to ko', async ({ page }) => {
    await page.goto('/en/components/modal-dialog');
    await expect(page.getByText('Open and close modals')).toBeVisible();
    await page.getByRole('link', { name: 'KO', exact: true }).click();
    await expect(page).toHaveURL(/\/ko\/components\/modal-dialog/);
    await expect(page.getByText('모달을 열고 닫으며')).toBeVisible();
  });
});
