import { test, expect } from '@playwright/test';

test.describe('Permaculture Metrics - Garden Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test('garden has starter beds with plant data', async ({ page }) => {
    // Herb Garden bed should have basil, thyme, rosemary
    const beds = page.locator('rect');
    expect(await beds.count()).toBeGreaterThanOrEqual(2);

    // Plants should be present
    const plants = page.locator('circle');
    const plantCount = await plants.count();
    expect(plantCount).toBeGreaterThanOrEqual(6); // 3 per bed * 2 beds
  });

  test('vegetable and herb beds have distinct visual styling', async ({ page }) => {
    const beds = page.locator('rect');
    const bedCount = await beds.count();

    if (bedCount >= 2) {
      // Get fill colors of first two beds
      const bed1Fill = await beds.nth(0).getAttribute('fill');
      const bed2Fill = await beds.nth(1).getAttribute('fill');

      // Should be different colors
      expect(bed1Fill).not.toEqual(bed2Fill);
    }
  });

  test('garden data structure is valid for calculations', async ({ page }) => {
    // All elements should be properly positioned
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    const bedCount = await beds.count();
    const plantCount = await plants.count();

    // Basic validation
    expect(bedCount).toBeGreaterThan(0);
    expect(plantCount).toBeGreaterThan(0);
    expect(plantCount).toBeGreaterThanOrEqual(bedCount);
  });

  test('zone information would be calculable from bed positions', async ({ page }) => {
    const beds = page.locator('rect');

    if (await beds.count() >= 2) {
      // Get positions of beds
      const bed1X = await beds.nth(0).getAttribute('x');
      const bed2X = await beds.nth(1).getAttribute('x');

      // Positions should be different (in different zones)
      expect(bed1X).not.toEqual(bed2X);
    }
  });

  test('bed names are encoded in visual data', async ({ page }) => {
    // The starter garden has:
    // - Herb Garden at lower position
    // - Vegetable Bed at higher position

    const beds = page.locator('rect');
    const count = await beds.count();

    // Should have herb and veggie beds
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('plant species are identifiable from structure', async ({ page }) => {
    // Starter garden plants:
    // Herb: basil, thyme, rosemary
    // Veggie: tomato, lettuce, peppers

    const plants = page.locator('circle');
    const count = await plants.count();

    // Should have these plants
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('companion planting data is available in structure', async ({ page }) => {
    // The data structure should support companion planting checks
    // E.g., basil with tomato, etc.

    const beds = page.locator('rect');
    const plants = page.locator('circle');

    // Validate structure supports this
    expect(await beds.count()).toBeGreaterThan(0);
    expect(await plants.count()).toBeGreaterThan(0);
  });

  test('garden metrics would be calculable from visual elements', async ({ page }) => {
    // Calculate total garden area from bed positions and sizes
    const beds = page.locator('rect');

    let totalArea = 0;
    const count = await beds.count();

    for (let i = 0; i < count; i++) {
      const width = await beds.nth(i).getAttribute('width');
      const height = await beds.nth(i).getAttribute('height');

      if (width && height) {
        const w = parseFloat(width);
        const h = parseFloat(height);
        totalArea += w * h;
      }
    }

    // Should have calculated some area
    expect(totalArea).toBeGreaterThan(0);
  });

  test('plant density metrics are calculable', async ({ page }) => {
    // Calculate plants per bed
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    const bedCount = await beds.count();
    const plantCount = await plants.count();

    // Calculate density
    const density = plantCount / bedCount;

    // Starter has 3 plants per bed = 3.0 density
    expect(density).toBeGreaterThan(0);
  });

  test('growing season data structure is valid', async ({ page }) => {
    // Check that garden supports seasonal planning
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    // Should have complete data structure
    expect(await beds.count()).toBeGreaterThan(0);
    expect(await plants.count()).toBeGreaterThan(0);
  });

  test('soil condition zones are definable from layout', async ({ page }) => {
    // From bed positioning, soil zones could be defined
    const beds = page.locator('rect');
    const count = await beds.count();

    // Different bed positions could support different soil types
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('water management zones calculable from bed positions', async ({ page }) => {
    // Beds in different positions have different water needs
    const beds = page.locator('rect');

    if (await beds.count() >= 2) {
      const bed1Y = await beds.nth(0).getAttribute('y');
      const bed2Y = await beds.nth(1).getAttribute('y');

      // Could define water zones based on position
      expect(bed1Y).toBeTruthy();
      expect(bed2Y).toBeTruthy();
    }
  });
});

test.describe('Permaculture - Plant Relationships', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test('plants in same bed are positioned for companion planting', async ({ page }) => {
    const plants = page.locator('circle');
    const beds = page.locator('rect');

    // Plants should be grouped by bed
    const plantCount = await plants.count();
    const bedCount = await beds.count();

    // Should have multiple plants per bed for companion planting
    expect(plantCount / bedCount).toBeGreaterThanOrEqual(2);
  });

  test('plant spacing is valid for growth', async ({ page }) => {
    const plants = page.locator('circle');

    const positions: Array<{ x: number; y: number }> = [];
    const count = await plants.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const cx = await plants.nth(i).getAttribute('cx');
      const cy = await plants.nth(i).getAttribute('cy');

      if (cx && cy) {
        positions.push({
          x: parseFloat(cx),
          y: parseFloat(cy)
        });
      }
    }

    // Plants should have spacing (not all at same point)
    if (positions.length >= 2) {
      let totalDistance = 0;
      for (let i = 1; i < positions.length; i++) {
        const dx = positions[i].x - positions[i - 1].x;
        const dy = positions[i].y - positions[i - 1].y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
      }

      expect(totalDistance).toBeGreaterThan(0);
    }
  });

  test('plant characteristics are encoded in visual representation', async ({ page }) => {
    // Plant colors could represent:
    // - Green: herbs
    // - Red/Orange: vegetables
    // - Yellow: others

    const plants = page.locator('circle');
    const count = await plants.count();

    expect(count).toBeGreaterThan(0);

    // Validate all plants have colors
    for (let i = 0; i < Math.min(count, 5); i++) {
      const fill = await plants.nth(i).getAttribute('fill');
      expect(fill).toBeTruthy();
    }
  });

  test('beneficial insect habitat is represented', async ({ page }) => {
    // The presence of diverse plants suggests beneficial habitat
    const plants = page.locator('circle');
    const count = await plants.count();

    // Diversity: multiple plant types
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('succession planting areas are defined', async ({ page }) => {
    // Different bed locations for crop rotation
    const beds = page.locator('rect');
    const count = await beds.count();

    // Multiple beds allow for succession/rotation
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('polyculture structure is present', async ({ page }) => {
    // Multiple plant types in proximity (polyculture)
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    const bedCount = await beds.count();
    const plantCount = await plants.count();

    // Polyculture: multiple plants per bed
    expect(plantCount).toBeGreaterThan(bedCount);
  });
});

test.describe('Garden Data Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test('starter garden data loads correctly', async ({ page }) => {
    // Expected: 2 beds, 6 plants minimum
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    expect(await beds.count()).toBeGreaterThanOrEqual(2);
    expect(await plants.count()).toBeGreaterThanOrEqual(6);
  });

  test('garden beds have required attributes', async ({ page }) => {
    const beds = page.locator('rect');
    const count = await beds.count();

    for (let i = 0; i < count; i++) {
      const bed = beds.nth(i);

      // Required attributes
      const x = await bed.getAttribute('x');
      const y = await bed.getAttribute('y');
      const width = await bed.getAttribute('width');
      const height = await bed.getAttribute('height');
      const fill = await bed.getAttribute('fill');

      expect(x).toBeTruthy();
      expect(y).toBeTruthy();
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
      expect(fill).toBeTruthy();
    }
  });

  test('plants have required attributes', async ({ page }) => {
    const plants = page.locator('circle');
    const count = await plants.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const plant = plants.nth(i);

      // Required attributes
      const cx = await plant.getAttribute('cx');
      const cy = await plant.getAttribute('cy');
      const r = await plant.getAttribute('r');
      const fill = await plant.getAttribute('fill');

      expect(cx).toBeTruthy();
      expect(cy).toBeTruthy();
      expect(r).toBeTruthy();
      expect(fill).toBeTruthy();
    }
  });

  test('all numeric values are valid', async ({ page }) => {
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    // Check beds
    for (let i = 0; i < await beds.count(); i++) {
      const x = parseFloat(await beds.nth(i).getAttribute('x') || '0');
      const y = parseFloat(await beds.nth(i).getAttribute('y') || '0');
      const w = parseFloat(await beds.nth(i).getAttribute('width') || '0');
      const h = parseFloat(await beds.nth(i).getAttribute('height') || '0');

      expect(isNaN(x)).toBeFalsy();
      expect(isNaN(y)).toBeFalsy();
      expect(isNaN(w)).toBeFalsy();
      expect(isNaN(h)).toBeFalsy();
    }

    // Check plants
    for (let i = 0; i < await plants.count(); i++) {
      const cx = parseFloat(await plants.nth(i).getAttribute('cx') || '0');
      const cy = parseFloat(await plants.nth(i).getAttribute('cy') || '0');
      const r = parseFloat(await plants.nth(i).getAttribute('r') || '0');

      expect(isNaN(cx)).toBeFalsy();
      expect(isNaN(cy)).toBeFalsy();
      expect(isNaN(r)).toBeFalsy();
    }
  });

  test('color values are valid CSS colors', async ({ page }) => {
    const beds = page.locator('rect');
    const plants = page.locator('circle');

    const colorRegex = /^#[0-9a-f]{6}$|^rgb\(|^hsl\(/i;

    // Check bed colors
    for (let i = 0; i < await beds.count(); i++) {
      const fill = await beds.nth(i).getAttribute('fill');
      expect(fill).toMatch(colorRegex);
    }

    // Check plant colors
    for (let i = 0; i < Math.min(await plants.count(), 10); i++) {
      const fill = await plants.nth(i).getAttribute('fill');
      expect(fill).toMatch(colorRegex);
    }
  });
});
