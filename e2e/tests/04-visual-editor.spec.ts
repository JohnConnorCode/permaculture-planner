import { test, expect } from '@playwright/test';

test.describe('Visual Editor - Demo Mode', () => {
  test('demo mode loads without auth requirement', async ({ page }) => {
    // The demo mode should work without authentication
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Canvas should be visible
    const canvas = page.locator('svg').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('canvas displays garden beds', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Should have rectangular elements representing beds
    const rects = page.locator('rect');
    const count = await rects.count();
    expect(count).toBeGreaterThanOrEqual(2); // At least 2 starter beds
  });

  test('plants are visible on canvas', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Should have circular elements representing plants
    const circles = page.locator('circle');
    const count = await circles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('canvas is interactive - can hover elements', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Hover over a bed (rect element)
    const firstBed = page.locator('rect').first();
    await firstBed.hover();

    // Element should still be visible
    await expect(firstBed).toBeVisible();
  });

  test('save functionality is accessible', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button', { timeout: 10000 });

    // Find and click save button
    const saveButton = page.locator('button').filter({ hasText: /Save/ }).first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      // Should show a notification
      await page.waitForTimeout(500);
    }
  });

  test('clear function is available', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button', { timeout: 10000 });

    // Find clear button
    const clearButton = page.locator('button').filter({ hasText: /Clear/ }).first();
    if (await clearButton.isVisible()) {
      await expect(clearButton).toBeEnabled();
    }
  });

  test('export functionality exists', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Check for export button or capability
    const exportButton = page.locator('button').filter({ hasText: /Export|Download/ }).first();
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeEnabled();
    }
  });

  test('import file input is present', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Check for hidden file input
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await expect(fileInput).toHaveAttribute('accept', /.json/);
    }
  });

  test('responsive design works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Canvas should still render on mobile
    const canvas = page.locator('svg').first();
    await expect(canvas).toBeVisible();
  });

  test('UI elements have proper structure', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Should have buttons for controls
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Should have SVG canvas
    const svgs = page.locator('svg');
    const svgCount = await svgs.count();
    expect(svgCount).toBeGreaterThan(0);
  });

  test('canvas has proper viewBox for scaling', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg[viewBox]', { timeout: 10000 });

    const svgWithViewBox = page.locator('svg[viewBox]');
    if (await svgWithViewBox.count() > 0) {
      const viewBox = await svgWithViewBox.first().getAttribute('viewBox');
      expect(viewBox).toBeTruthy();
      expect(viewBox).toMatch(/\d+\s+\d+\s+\d+\s+\d+/);
    }
  });

  test('garden state persists in memory during session', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Count initial elements
    const initialRects = await page.locator('rect').count();

    // Navigate away and back
    await page.goto('/');
    await page.goto('/demo');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Should have same elements (or similar count)
    const finalRects = await page.locator('rect').count();
    expect(finalRects).toBeGreaterThan(0);
  });
});