import { test, expect } from '@playwright/test';

test.describe('Critical User Journey Paths', () => {
  test('complete onboarding flow for new users', async ({ page, context }) => {
    // Clear storage state to simulate new user
    await context.clearCookies();
    await context.clearPermissions();

    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Check if garden canvas loads
    await expect(page.locator('svg')).toBeVisible({ timeout: 10000 });

    // Verify main UI elements are present
    const mainElements = [
      'button:has-text("Save")',
      'button:has-text("Load")',
      'button:has-text("Clear")',
      '[role="tablist"]' // Element selector tabs
    ];

    for (const selector of mainElements) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        await expect(element).toBeVisible({ timeout: 5000 });
      }
    }

    // Verify canvas is interactive
    const canvas = page.locator('svg[viewBox]').first();
    await expect(canvas).toBeVisible();
  });

  test('ActionFeedback system shows success and error messages', async ({ page }) => {
    await page.goto('/demo');

    // Wait for page to load
    await page.waitForSelector('svg', { timeout: 10000 });

    // Test success feedback - Save action
    const saveButton = page.locator('button:has-text("Save")');
    if (await saveButton.count() > 0) {
      await saveButton.click();

      // Look for success feedback (could be toast, notification, or status change)
      await expect(page.locator('text=/saved|success|complete/i').first()).toBeVisible({ timeout: 5000 });
    }

    // Test feedback when loading example garden
    const loadButton = page.locator('button:has-text("Load Example Garden")');
    if (await loadButton.count() > 0) {
      await loadButton.click();

      // Verify feedback message appears
      await expect(page.locator('text=/loaded|example/i').first()).toBeVisible({ timeout: 5000 });
    }

    // Test clear action feedback
    const clearButton = page.locator('button:has-text("Clear")');
    if (await clearButton.count() > 0) {
      await clearButton.click();

      // Confirm dialog should appear
      page.once('dialog', dialog => dialog.accept());

      // Check for cleared feedback
      await expect(page.locator('text=/cleared|empty/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('permaculture elements are available and functional in demo', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');

    // Wait for page to load
    await page.waitForSelector('svg', { timeout: 10000 });

    // Check for element categories in tabs or buttons
    const waterTab = page.locator('[role="tab"]:has-text("Water"), button:has-text("Water")').first();
    await expect(waterTab).toBeVisible({ timeout: 5000 });

    // Verify different element categories exist as tabs
    const elementCategories = [
      'Water',
      'Structures',
      'Access',
      'Energy',
      'Animals'
    ];

    for (const category of elementCategories) {
      // Look for tabs or buttons with category names
      const categorySelector = page.locator(`[role="tab"]:has-text("${category}"), button:has-text("${category}")`).first();
      if (await categorySelector.count() > 0) {
        await expect(categorySelector).toBeVisible({ timeout: 3000 });
      }
    }

    // Test element placement
    const elementTool = page.locator('button:has-text("Element")');
    if (await elementTool.count() > 0) {
      await elementTool.click();

      // Select an element type if available
      const waterElement = page.locator('button').filter({ hasText: /water|pond|well/i });
      if (await waterElement.count() > 0) {
        await waterElement.first().click();

        // Try to place on canvas
        await page.locator('svg[viewBox]').last().click({ position: { x: 400, y: 300 } });
        await page.waitForTimeout(500);
      }
    }
  });

  test('responsive design works across all breakpoints', async ({ page }) => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'laptop', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/');

      // Test homepage responsiveness
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Begin Your Design')).toBeVisible();

      // Test navigation and layout
      if (breakpoint.width >= 768) {
        // Desktop/tablet should show full navigation
        await expect(page.locator('text=Features')).toBeVisible();
        await expect(page.locator('text=Zone & Sector Analysis')).toBeVisible();
      }

      // Test wizard responsiveness
      await page.goto('/wizard');
      await expect(page.locator('text=Create Your Permaculture Garden')).toBeVisible();
      await expect(page.locator('input[id="city"]')).toBeVisible();

      // Test demo page responsiveness
      await page.goto('/demo');
      await page.waitForSelector('svg', { timeout: 10000 });
      // Check for sidebar or main content
      const sidebar = page.locator('[role="complementary"], aside, .sidebar').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });

      if (breakpoint.width >= 768) {
        // Desktop should show sidebar
        await expect(page.locator('text=Drawing Tools')).toBeVisible();
        await expect(page.locator('text=Plant Library')).toBeVisible();
      } else {
        // Mobile should show tools in bottom panel or mobile menu
        const mobileTools = page.locator('button:has-text("Select"), button:has-text("Rectangle")');
        await expect(mobileTools.first()).toBeVisible();
      }
    }
  });

  test('end-to-end user journey: Homepage → Wizard → Demo → Save', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Design Regenerative');

    // 2. Navigate to wizard
    await page.click('text=Begin Your Design');
    await expect(page).toHaveURL(/\/wizard/);
    await expect(page.locator('text=Create Your Permaculture Garden')).toBeVisible();

    // 3. Fill out wizard steps
    // Step 1: Location
    await page.fill('input[id="city"]', 'Portland, OR');
    await page.selectOption('select', '9a'); // USDA Zone
    await page.click('button:has-text("Next Step")');

    // Step 2: Area (assuming form fields exist)
    await expect(page.locator('text=Step 2 of 7')).toBeVisible();
    // Fill basic area info if inputs are available
    const areaInput = page.locator('input[type="number"]').first();
    if (await areaInput.count() > 0) {
      await areaInput.fill('200');
    }
    await page.click('button:has-text("Next Step")');

    // Continue through remaining steps quickly
    for (let i = 3; i <= 6; i++) {
      await expect(page.locator(`text=Step ${i} of 7`)).toBeVisible({ timeout: 5000 });

      // Fill any required fields with defaults
      const inputs = page.locator('input, select');
      const inputCount = await inputs.count();
      for (let j = 0; j < Math.min(inputCount, 3); j++) {
        const input = inputs.nth(j);
        const type = await input.getAttribute('type');
        if (type === 'text') {
          await input.fill('test');
        } else if (type === 'number') {
          await input.fill('10');
        }
      }

      await page.click('button:has-text("Next Step")');
      await page.waitForTimeout(500);
    }

    // Step 7: Review and Complete
    await expect(page.locator(`text=Step 7 of 7`)).toBeVisible();
    const generateButton = page.locator('button:has-text("Generate My Garden Plan")');

    if (await generateButton.count() > 0) {
      await generateButton.click();

      // Should redirect to plans page or demo
      await page.waitForURL(/\/(plans|demo|dashboard)/, { timeout: 10000 });
    } else {
      // Fallback: navigate to demo manually
      await page.goto('/demo');
    }

    // 4. Use the demo/garden designer
    await page.waitForSelector('svg', { timeout: 10000 });
    await expect(page.locator('text=Real Garden Designer')).toBeVisible();

    // Create a garden bed
    await page.click('button:has-text("Rectangle")');
    await page.locator('svg[viewBox]').last().click({ position: { x: 200, y: 200 } });
    await page.locator('svg[viewBox]').last().click({ position: { x: 350, y: 300 } });

    // Add a plant
    const vegetablesTab = page.locator('text=Veggies');
    if (await vegetablesTab.count() > 0) {
      await vegetablesTab.click();

      // Select a plant
      const plantButton = page.locator('button').filter({ hasText: /lettuce|tomato|carrot/i });
      if (await plantButton.count() > 0) {
        await plantButton.first().click();

        // Place plant in bed
        await page.locator('svg[viewBox]').last().click({ position: { x: 275, y: 250 } });
      }
    }

    // 5. Save the design
    const saveButton = page.locator('button:has-text("Save")');
    if (await saveButton.count() > 0) {
      await saveButton.click();

      // Verify save feedback
      await expect(page.locator('text=/saved|success/i').first()).toBeVisible({ timeout: 5000 });
    }

    // 6. Verify the garden has content
    const beds = page.locator('path[fill="#f0fdf4"], path[fill="#e0f2e0"]');
    await expect(beds.first()).toBeVisible();
  });

  test('accessibility and keyboard navigation work correctly', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation on homepage
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should activate focused element

    // Go to demo for more complex interactions
    await page.goto('/demo');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Test keyboard shortcuts
    await page.keyboard.press('v'); // Select tool
    await page.keyboard.press('r'); // Rectangle tool
    await page.keyboard.press('p'); // Plant tool

    // Test escape key
    await page.keyboard.press('Escape'); // Should return to select tool

    // Test undo/redo shortcuts
    await page.keyboard.press('Control+z'); // Undo
    await page.keyboard.press('Control+y'); // Redo

    // Verify tools respond to keyboard
    const selectButton = page.locator('button:has-text("Select")');
    await expect(selectButton).toHaveClass(/default|selected|active/);
  });

  test('error handling and edge cases work properly', async ({ page }) => {
    await page.goto('/demo');
    await page.waitForSelector('svg', { timeout: 10000 });

    // Test invalid plant placement (outside canvas bounds)
    // Try to interact with a plant button if available
    const plantButtons = page.locator('button').filter({ hasText: /tomato|lettuce|carrot|herbs/i });
    if (await plantButtons.count() > 0) {
      await plantButtons.first().click();
      await page.waitForTimeout(500);
    };

    // Test canvas interaction
    const canvas = page.locator('svg[viewBox]').first();
    if (await canvas.count() > 0) {
      await plantButton.first().click();

      // Try to place plant outside valid area
      await page.locator('svg[viewBox]').last().click({ position: { x: -50, y: -50 } });

      // Should not crash or create invalid elements
      await page.waitForTimeout(500);
    }

    // Test rapid tool switching
    const tools = ['select', 'rect', 'circle', 'plant'];
    for (const tool of tools) {
      const toolButton = page.locator(`button:has-text("${tool.charAt(0).toUpperCase() + tool.slice(1)}")`);
      if (await toolButton.count() > 0) {
        await toolButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Test browser back/forward navigation
    await page.goBack();
    await page.waitForTimeout(500);
    await page.goForward();
    await page.waitForTimeout(500);

    // Verify demo still works after navigation
    await expect(page.locator('text=Real Garden Designer')).toBeVisible();
  });

  test('performance: page loads and interactions are responsive', async ({ page }) => {
    // Start timing
    const startTime = Date.now();

    await page.goto('/');

    // Homepage should load quickly
    await expect(page.locator('h1')).toBeVisible();
    const homepageLoadTime = Date.now() - startTime;
    expect(homepageLoadTime).toBeLessThan(5000); // 5 seconds max

    // Demo page should load in reasonable time
    const demoStartTime = Date.now();
    await page.goto('/demo');
    await page.waitForSelector('svg', { timeout: 10000 });
    const demoLoadTime = Date.now() - demoStartTime;
    expect(demoLoadTime).toBeLessThan(8000); // 8 seconds max for complex page

    // Tool switching should be immediate
    const tools = ['Rectangle', 'Circle', 'Select'];
    for (const tool of tools) {
      const switchStart = Date.now();
      const toolButton = page.locator(`button:has-text("${tool}")`);
      if (await toolButton.count() > 0) {
        await toolButton.click();
        const switchTime = Date.now() - switchStart;
        expect(switchTime).toBeLessThan(500); // Tool switch should be instant
      }
    }

    // Canvas interactions should be responsive
    const interactionStart = Date.now();
    await page.locator('svg[viewBox]').last().click({ position: { x: 200, y: 200 } });
    await page.waitForTimeout(100);
    const interactionTime = Date.now() - interactionStart;
    expect(interactionTime).toBeLessThan(1000); // Canvas interactions under 1 second
  });
});