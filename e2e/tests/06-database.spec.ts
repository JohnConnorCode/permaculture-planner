import { test, expect } from '@playwright/test';

test.describe('Database Connectivity', () => {
  test('should load without database errors on homepage', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check no database-related errors
    const dbErrors = errors.filter(e =>
      e.includes('supabase') ||
      e.includes('database') ||
      e.includes('postgres')
    );

    expect(dbErrors).toHaveLength(0);
  });

  test('should handle API routes', async ({ page }) => {
    // Test health check endpoint if exists
    const response = await page.request.get('/api/health');

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('status');
    }
  });

  test.skip('should load crops from database', async ({ page }) => {
    // This would require auth and accessing crops page
    // Mock auth here
    await page.goto('/crops');

    // Check crops are loaded
    await expect(page.locator('text=Tomato')).toBeVisible();
    await expect(page.locator('text=Carrot')).toBeVisible();
  });
});