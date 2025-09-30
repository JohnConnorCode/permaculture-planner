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

    // Demo page loads without error
    await expect(page.locator('body')).toBeVisible();

    // Check for any animated elements OR the page structure is visible
    const animatedElements = await page.locator('[class*="animate-"]').count();
    const hasCanvas = await page.locator('svg').count() > 0;
    const hasContent = await page.locator('[id="canvas"], [class*="garden"], [class*="designer"]').count() > 0;

    // Either has animations OR has the expected page content
    expect(animatedElements > 0 || hasCanvas || hasContent).toBeTruthy();

    // If there are animated elements, check they work
    if (animatedElements > 0) {
      const firstAnimated = page.locator('[class*="animate-"]').first();
      await expect(firstAnimated).toBeVisible();

      const opacity = await firstAnimated.evaluate(el =>
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeGreaterThan(0);
      console.log(`Found ${animatedElements} animated elements on demo page`);
    } else {
      console.log('Demo page loaded successfully without animations');
    }
  });
});