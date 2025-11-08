import { test as base, expect, Page } from '@playwright/test';

// Extend basic test by providing "page" fixture that initializes storage
export const test = base.extend<{
  pageWithStorage: Page;
}>({
  pageWithStorage: async ({ page }, use) => {
    // Initialize localStorage before each test
    await page.goto('/demo');

    // Set up localStorage context before any test interactions
    await page.addInitScript(() => {
      // Ensure localStorage is accessible
      window.localStorage.clear();
    });

    // Use the page
    await use(page);

    // Cleanup after test
    await page.close();
  },
});

export { expect };
