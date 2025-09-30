import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Permaculture Planner/);
  });

  test('should display hero section with key elements', async ({ page }) => {
    await page.goto('/');

    // Check hero heading
    await expect(page.locator('h1')).toContainText('Design Regenerative');
    await expect(page.locator('h1')).toContainText('Ecosystems');

    // Check hero description
    await expect(page.locator('text=/Design complete permaculture systems/')).toBeVisible();

    // Check CTA buttons
    await expect(page.locator('text=Begin Your Design')).toBeVisible();
    await expect(page.locator('text=Explore Platform')).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    const features = [
      'Zone & Sector Analysis',
      'Water Harvesting Systems',
      'Food Forest Designer',
      'Soil Building & Composting',
      'Microclimate Mapping',
      'Earthworks & Contouring'
    ];

    for (const feature of features) {
      await expect(page.locator(`h3:has-text("${feature}")`).first()).toBeVisible();
    }
  });

  test('should navigate to wizard from CTA button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Begin Your Design');
    await expect(page).toHaveURL(/\/wizard/);
  });

  test('should display space examples', async ({ page }) => {
    await page.goto('/');

    const spaces = ['Urban Spaces', 'Suburban Gardens', 'Large Plots'];

    for (const space of spaces) {
      await expect(page.locator(`text=${space}`)).toBeVisible();
    }
  });
});