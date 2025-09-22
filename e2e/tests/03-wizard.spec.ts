import { test, expect } from '@playwright/test';

test.describe('Garden Setup Wizard', () => {
  test('should display wizard step 1 - Location', async ({ page }) => {
    await page.goto('/wizard');

    // Check heading and step indicator
    await expect(page.locator('text=Create Your Garden Plan')).toBeVisible();
    await expect(page.locator('text=Step 1 of 6: Location')).toBeVisible();

    // Check form fields
    await expect(page.locator('input[id="city"]')).toBeVisible();
    await expect(page.locator('text=USDA Hardiness Zone')).toBeVisible();
    await expect(page.locator('input[id="last_frost"]')).toBeVisible();
    await expect(page.locator('input[id="first_frost"]')).toBeVisible();

    // Check navigation buttons
    await expect(page.locator('button:has-text("Back")')).toBeDisabled();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('should navigate through wizard steps', async ({ page }) => {
    await page.goto('/wizard');

    // Step 1: Fill location data
    await page.fill('input[id="city"]', 'Portland, OR');
    await page.click('button:has-text("Next")');

    // Should advance to Step 2
    await expect(page.locator('text=Step 2 of 6')).toBeVisible();

    // Back button should now be enabled
    await expect(page.locator('button:has-text("Back")')).toBeEnabled();

    // Go back to step 1
    await page.click('button:has-text("Back")');
    await expect(page.locator('text=Step 1 of 6')).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    await page.goto('/wizard');

    // Check progress bar exists
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();

    // Initial progress should be ~16% (1/6)
    const progressValue = await progressBar.locator('div').first().getAttribute('style');
    expect(progressValue).toContain('translateX(-83');
  });

  test('should validate required fields before proceeding', async ({ page }) => {
    await page.goto('/wizard');

    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();

    // Should still be on step 1 (validation prevents advancement)
    await expect(page.locator('text=Step 1 of 6')).toBeVisible();
  });

  test('should link to USDA zone finder', async ({ page }) => {
    await page.goto('/wizard');

    // Check for zone finder link
    const zoneLink = page.locator('a:has-text("Find your zone")');
    await expect(zoneLink).toBeVisible();
    await expect(zoneLink).toHaveAttribute('href', 'https://planthardiness.ars.usda.gov/');
    await expect(zoneLink).toHaveAttribute('target', '_blank');
  });

  test('should handle wizard completion', async ({ page }) => {
    await page.goto('/wizard');

    // Fill step 1
    await page.fill('input[id="city"]', 'Portland, OR');
    await page.click('button:has-text("Next")');

    // Continue through remaining steps (simplified)
    for (let i = 2; i <= 6; i++) {
      await expect(page.locator(`text=Step ${i} of 6`)).toBeVisible();

      if (i < 6) {
        await page.click('button:has-text("Next")');
      } else {
        // Last step should have "Complete" or "Create Garden" button
        const completeButton = page.locator('button').filter({
          hasText: /Complete|Create|Finish/i
        });

        if (await completeButton.count() > 0) {
          await expect(completeButton.first()).toBeVisible();
        }
      }
    }
  });
});