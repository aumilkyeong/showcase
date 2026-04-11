import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Image Carousel (ko)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/components/image-carousel');
  });

  test('page loads with Korean text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Image Carousel' }),
    ).toBeVisible();
    await expect(page.getByText('버튼과 닷을 클릭하고')).toBeVisible();
  });

  test('basic demo: click next button advances slide', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const nextButton = carousel.getByRole('button', { name: '다음 이미지' });

    await nextButton.click();

    const secondDot = carousel.getByRole('tab', { name: '2번째 이미지로 이동' });
    await expect(secondDot).toHaveAttribute('aria-selected', 'true');
  });

  test('basic demo: click prev button goes back', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const nextButton = carousel.getByRole('button', { name: '다음 이미지' });
    const prevButton = carousel.getByRole('button', { name: '이전 이미지' });

    await nextButton.click();
    await prevButton.click();

    const firstDot = carousel.getByRole('tab', { name: '1번째 이미지로 이동' });
    await expect(firstDot).toHaveAttribute('aria-selected', 'true');
  });

  test('basic demo: dot click jumps to specific slide', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const thirdDot = carousel.getByRole('tab', { name: '3번째 이미지로 이동' });

    await thirdDot.click();

    await expect(thirdDot).toHaveAttribute('aria-selected', 'true');
  });

  test('basic demo: loop wraps from last to first', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const nextButton = carousel.getByRole('button', { name: '다음 이미지' });

    // Navigate to the last slide
    const lastDot = carousel.getByRole('tab', { name: '5번째 이미지로 이동' });
    await lastDot.click();
    await expect(lastDot).toHaveAttribute('aria-selected', 'true');

    // Click next → should wrap to first
    await nextButton.click();
    const firstDot = carousel.getByRole('tab', { name: '1번째 이미지로 이동' });
    await expect(firstDot).toHaveAttribute('aria-selected', 'true');
  });

  test('basic demo: loop off disables prev at first slide', async ({ page }) => {
    // Toggle loop off — button has no accessible name, find by aria-pressed
    const loopToggle = page.locator('button[aria-pressed="true"]').first();
    await loopToggle.click();

    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const prevButton = carousel.getByRole('button', { name: '이전 이미지' });

    await expect(prevButton).toBeDisabled();
  });

  test('keyboard: arrow keys navigate slides', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    await carousel.focus();

    await carousel.press('ArrowRight');
    const secondDot = carousel.getByRole('tab', { name: '2번째 이미지로 이동' });
    await expect(secondDot).toHaveAttribute('aria-selected', 'true');

    await carousel.press('ArrowLeft');
    const firstDot = carousel.getByRole('tab', { name: '1번째 이미지로 이동' });
    await expect(firstDot).toHaveAttribute('aria-selected', 'true');
  });

  test('keyboard: Home/End jump to first/last', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    await carousel.focus();

    await carousel.press('End');
    const lastDot = carousel.getByRole('tab', { name: '5번째 이미지로 이동' });
    await expect(lastDot).toHaveAttribute('aria-selected', 'true');

    await carousel.press('Home');
    const firstDot = carousel.getByRole('tab', { name: '1번째 이미지로 이동' });
    await expect(firstDot).toHaveAttribute('aria-selected', 'true');
  });

  test('flux demo: actions are logged', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: '02' });
    const carousel = section.getByRole('region', { name: 'Image Carousel' });
    const nextButton = carousel.getByRole('button', { name: '다음 이미지' });

    await nextButton.click();

    await expect(section.getByText('NEXT_IMAGE (button)')).toBeVisible();
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Image Carousel (en)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/components/image-carousel');
  });

  test('page loads with English text', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Image Carousel' }),
    ).toBeVisible();
    await expect(page.getByText('Click buttons and dots')).toBeVisible();
  });

  test('basic demo: next and prev navigation', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Image Carousel' }).first();
    const nextButton = carousel.getByRole('button', { name: '다음 이미지' });

    await nextButton.click();

    const secondDot = carousel.getByRole('tab', { name: '2번째 이미지로 이동' });
    await expect(secondDot).toHaveAttribute('aria-selected', 'true');
  });

  test('axe accessibility scan passes', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

