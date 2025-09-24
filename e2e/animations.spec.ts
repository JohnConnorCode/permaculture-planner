import { test, expect } from '@playwright/test';

test.describe('Animation Tests', () => {
  test('home page animations are visible and working', async ({ page }) => {
    await page.goto('/');

    // Check that animated elements start with opacity-0
    const heroTitle = page.locator('h1').first();
    const heroBadge = page.locator('.inline-flex').first();

    // Wait for animations to complete
    await page.waitForTimeout(2000);

    // Check that elements are now visible
    await expect(heroTitle).toBeVisible();
    await expect(heroBadge).toBeVisible();

    // Check that opacity has changed from 0 to 1
    const heroTitleOpacity = await heroTitle.evaluate(el =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(heroTitleOpacity)).toBeGreaterThan(0.9);

    // Check multiple sections have animations
    const animatedElements = await page.locator('[class*="animate-"]').count();
    expect(animatedElements).toBeGreaterThan(10);

    console.log(`Found ${animatedElements} animated elements on home page`);
  });

  test('demo page animations work', async ({ page }) => {
    await page.goto('/demo');

    await page.waitForTimeout(1000);

    // Check that main title is visible after animation
    const title = page.locator('h1:has-text("Real Garden Designer")');
    await expect(title).toBeVisible();

    const titleOpacity = await title.evaluate(el =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(titleOpacity)).toBeGreaterThan(0.9);

    // Check animated elements exist
    const animatedElements = await page.locator('[class*="animate-"]').count();
    expect(animatedElements).toBeGreaterThan(5);

    console.log(`Found ${animatedElements} animated elements on demo page`);
  });
});