import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Permaculture Planner/);
  });

  test('should display hero section with key elements', async ({ page }) => {
    await page.goto('/');

    // Check hero heading
    await expect(page.locator('h1')).toContainText('Permaculture Planning Made Simple');

    // Check hero description
    await expect(page.locator('text=/raised-bed garden/')).toBeVisible();

    // Check CTA buttons
    await expect(page.locator('text=Start Planning')).toBeVisible();
    await expect(page.locator('text=View Demo')).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    const features = [
      'Smart Layout Generation',
      'Materials Calculator',
      'Crop Rotation Planning',
      'Water-Smart Design',
      'IPM & Companion Planting',
      'AI Garden Assistant'
    ];

    for (const feature of features) {
      await expect(page.locator(`text=${feature}`)).toBeVisible();
    }
  });

  test('should navigate to wizard from CTA button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Planning');
    await expect(page).toHaveURL(/\/wizard/);
  });

  test('should display space examples', async ({ page }) => {
    await page.goto('/');

    const spaces = ['Urban Balcony', 'Suburban Yard', 'Quarter Acre'];

    for (const space of spaces) {
      await expect(page.locator(`text=${space}`)).toBeVisible();
    }
  });
});