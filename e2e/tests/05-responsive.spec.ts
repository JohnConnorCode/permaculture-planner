import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Begin Your Design')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check layout
    await expect(page.locator('h1')).toBeVisible();

    // Feature cards should be in grid
    const featureCards = page.locator('.grid').first();
    await expect(featureCards).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/signup');

    // Check form is accessible on mobile
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});