import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display signup page with all fields', async ({ page }) => {
    await page.goto('/auth/signup');

    // Check page title
    await expect(page.locator('text=Create Account')).toBeVisible();

    // Check all form fields
    await expect(page.locator('input[id="fullName"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();

    // Check Google OAuth button
    await expect(page.locator('text=Google')).toBeVisible();

    // Check login link (use first occurrence to avoid strict mode)
    await expect(page.locator('a[href="/auth/login"]:has-text("Sign in")').first()).toBeVisible();
  });

  test('should display login page with all fields', async ({ page }) => {
    await page.goto('/auth/login');

    // Check page title
    await expect(page.locator('text=Welcome Back')).toBeVisible();

    // Check form fields
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();

    // Check signup link (use first occurrence to avoid strict mode)
    await expect(page.locator('a[href="/auth/signup"]:has-text("Sign up")').first()).toBeVisible();
  });

  test('should validate email format on signup', async ({ page }) => {
    await page.goto('/auth/signup');

    // Fill invalid email
    await page.fill('input[id="email"]', 'invalid-email');
    await page.fill('input[id="password"]', 'password123');
    await page.fill('input[id="fullName"]', 'Test User');

    // Try to submit
    await page.click('button[type="submit"]');

    // Check for validation (browser native validation)
    const emailInput = page.locator('input[id="email"]');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('should enforce minimum password length', async ({ page }) => {
    await page.goto('/auth/signup');

    // Fill short password
    await page.fill('input[id="password"]', '12345');

    // Check for validation message
    const passwordInput = page.locator('input[id="password"]');
    const validity = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/auth/login');

    // Click create account link
    await page.locator('a[href="/auth/signup"]:has-text("Sign up")').first().click();
    await expect(page).toHaveURL(/\/auth\/signup/);

    // Click sign in link
    await page.locator('a[href="/auth/login"]:has-text("Sign in")').first().click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should show terms and privacy links on signup', async ({ page }) => {
    await page.goto('/auth/signup');

    // Use first occurrence to avoid strict mode violations with footer links
    await expect(page.locator('text=Terms of Service').first()).toBeVisible();
    await expect(page.locator('text=Privacy Policy').first()).toBeVisible();
  });
});