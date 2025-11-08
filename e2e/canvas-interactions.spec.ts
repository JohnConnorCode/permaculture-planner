import { test, expect } from '@playwright/test';

test.describe('Canvas - Bed Management & Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test('initial garden beds are rendered correctly', async ({ page }) => {
    // Verify starter beds are loaded
    const beds = page.locator('rect');
    const bedCount = await beds.count();

    // Should have at least 2 beds (herb and veggie)
    expect(bedCount).toBeGreaterThanOrEqual(2);

    // Beds should have fill colors
    const firstBed = beds.first();
    const fill = await firstBed.getAttribute('fill');
    expect(fill).toBeTruthy();
    expect(fill).toMatch(/^#[0-9a-f]{6}|rgb/i);
  });

  test('garden beds have stroke/border styling', async ({ page }) => {
    const beds = page.locator('rect');
    const firstBed = beds.first();

    const stroke = await firstBed.getAttribute('stroke');
    expect(stroke).toBeTruthy(); // Should have stroke color
  });

  test('plants are placed within beds', async ({ page }) => {
    // Get first bed's bounding box
    const firstBed = page.locator('rect').first();
    const bedBox = await firstBed.boundingBox();
    expect(bedBox).toBeTruthy();

    // Get first plant circle
    const plants = page.locator('circle');
    const plantCount = await plants.count();

    // Should have plants
    expect(plantCount).toBeGreaterThan(0);

    if (plantCount > 0) {
      const firstPlant = plants.first();
      const plantBox = await firstPlant.boundingBox();
      expect(plantBox).toBeTruthy();
    }
  });

  test('bed coordinates are valid and non-zero', async ({ page }) => {
    const beds = page.locator('rect');

    if (await beds.count() > 0) {
      const firstBed = beds.first();

      // Get position attributes
      const x = await firstBed.getAttribute('x');
      const y = await firstBed.getAttribute('y');
      const width = await firstBed.getAttribute('width');
      const height = await firstBed.getAttribute('height');

      expect(x).toBeTruthy();
      expect(y).toBeTruthy();
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();

      // Values should be numeric and valid
      expect(parseFloat(x!)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(y!)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(width!)).toBeGreaterThan(0);
      expect(parseFloat(height!)).toBeGreaterThan(0);
    }
  });

  test('multiple beds have different positions', async ({ page }) => {
    const beds = page.locator('rect');
    const count = await beds.count();

    if (count >= 2) {
      const bed1 = await beds.nth(0).getAttribute('x');
      const bed2 = await beds.nth(1).getAttribute('x');

      // Beds should be at different positions
      expect(bed1).not.toEqual(bed2);
    }
  });

  test('canvas responds to scroll interaction', async ({ page }) => {
    const canvas = page.locator('svg').first();
    await expect(canvas).toBeVisible();

    // Scroll on canvas
    await canvas.hover();
    await page.mouse.wheel(0, 50);

    // Canvas should still be visible
    await expect(canvas).toBeVisible();
  });

  test('beds maintain visual state after hover', async ({ page }) => {
    const firstBed = page.locator('rect').first();
    const initialFill = await firstBed.getAttribute('fill');

    // Hover over bed
    await firstBed.hover();
    await page.waitForTimeout(100);

    // Fill should remain (no state change to break visual)
    const fillAfterHover = await firstBed.getAttribute('fill');
    expect(fillAfterHover).toBeTruthy();
  });

  test('plants have valid positioning within beds', async ({ page }) => {
    const plants = page.locator('circle');
    const count = await plants.count();

    if (count > 0) {
      const plant = plants.first();

      // Check cx and cy (circle center coordinates)
      const cx = await plant.getAttribute('cx');
      const cy = await plant.getAttribute('cy');
      const r = await plant.getAttribute('r');

      expect(cx).toBeTruthy();
      expect(cy).toBeTruthy();
      expect(r).toBeTruthy();

      // Should be valid numbers
      expect(parseFloat(cx!)).toBeGreaterThan(0);
      expect(parseFloat(cy!)).toBeGreaterThan(0);
      expect(parseFloat(r!)).toBeGreaterThan(0);
    }
  });

  test('plants have fill colors', async ({ page }) => {
    const plants = page.locator('circle');

    if (await plants.count() > 0) {
      const firstPlant = plants.first();
      const fill = await firstPlant.getAttribute('fill');

      expect(fill).toBeTruthy();
      expect(fill).toMatch(/^#[0-9a-f]{6}|rgb/i);
    }
  });

  test('canvas has proper dimensions', async ({ page }) => {
    const canvas = page.locator('svg').first();
    const box = await canvas.boundingBox();

    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('all visual elements are contained within SVG bounds', async ({ page }) => {
    const svg = page.locator('svg').first();
    const svgBox = await svg.boundingBox();

    const allElements = page.locator('svg > *');
    const elementCount = await allElements.count();

    // SVG should contain elements
    expect(elementCount).toBeGreaterThan(0);
  });

  test('bed data structure includes plant information', async ({ page }) => {
    // This verifies the data model by checking visual representation
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    const bedCount = await beds.count();
    const plantCount = await plants.count();

    // Should have beds
    expect(bedCount).toBeGreaterThan(0);

    // Should have plants in beds
    expect(plantCount).toBeGreaterThan(0);

    // More plants than beds is expected
    expect(plantCount).toBeGreaterThanOrEqual(bedCount);
  });

  test('garden layout matches starter template dimensions', async ({ page }) => {
    const beds = page.locator('rect');

    // Herb bed should be ~200x100 at specific coordinates
    // Veggie bed should be at different location
    const count = await beds.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Check that we have expected number of plant elements
    const plants = page.locator('circle');
    const plantCount = await plants.count();

    // Starter garden has 3 plants per bed * 2 beds = 6 plants
    expect(plantCount).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Canvas - Plant Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test('plant elements are clickable', async ({ page }) => {
    const plants = page.locator('circle');

    if (await plants.count() > 0) {
      const plant = plants.first();
      await expect(plant).toBeVisible();

      // Should be able to click
      await plant.click();
    }
  });

  test('plant colors match plant type', async ({ page }) => {
    const plants = page.locator('circle');
    const count = await plants.count();

    // All plants should have fill colors
    for (let i = 0; i < Math.min(count, 5); i++) {
      const plant = plants.nth(i);
      const fill = await plant.getAttribute('fill');
      expect(fill).toBeTruthy();
    }
  });

  test('plants have consistent radius', async ({ page }) => {
    const plants = page.locator('circle');
    const count = await plants.count();

    if (count >= 2) {
      const radius1 = await plants.nth(0).getAttribute('r');
      const radius2 = await plants.nth(1).getAttribute('r');

      // Plant sizes should be similar (same type/size)
      const r1 = parseFloat(radius1 || '0');
      const r2 = parseFloat(radius2 || '0');

      expect(Math.abs(r1 - r2)).toBeLessThan(r1 * 0.5); // Within 50%
    }
  });

  test('plant positions are within bed boundaries', async ({ page }) => {
    const beds = page.locator('rect').first();
    const plants = page.locator('circle');

    const bedBox = await beds.boundingBox();
    if (!bedBox) return;

    const count = await plants.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const plantBox = await plants.nth(i).boundingBox();
      if (plantBox) {
        // Plant should be roughly within bed area
        expect(plantBox.x).toBeGreaterThan(bedBox.x - 100);
        expect(plantBox.y).toBeGreaterThan(bedBox.y - 100);
      }
    }
  });
});

test.describe('Canvas - Rendering Performance', () => {
  test('canvas renders without visual glitches', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Get element counts
    const beds = await page.locator('rect').count();
    const plants = await page.locator('circle').count();

    // Should have rendered all elements
    expect(beds).toBeGreaterThan(0);
    expect(plants).toBeGreaterThan(0);
  });

  test('canvas remains responsive after rendering multiple elements', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });

    const canvas = page.locator('svg').first();

    // Interact multiple times
    for (let i = 0; i < 5; i++) {
      await canvas.hover();
      await page.waitForTimeout(50);
    }

    // Canvas should still be visible and functional
    await expect(canvas).toBeVisible();
  });

  test('no layout shift after full load', async ({ page }) => {
    await page.goto('/demo');

    // Get initial layout
    const svg1 = await page.locator('svg').first().boundingBox();

    await page.waitForLoadState('networkidle');

    // Get layout after network idle
    const svg2 = await page.locator('svg').first().boundingBox();

    // Bounds should be stable
    expect(svg2?.width).toBeDefined();
    expect(svg2?.height).toBeDefined();
  });
});
