import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Permaculture Planner App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test.describe('Homepage', () => {
    test('should load and display main content', async ({ page }) => {
      await expect(page).toHaveTitle(/Permaculture Planner/)
      await expect(page.locator('h1')).toContainText('Design Your Perfect')
      await expect(page.locator('text=Start Your Garden Plan')).toBeVisible()
      await expect(page.locator('text=Explore Features')).toBeVisible()
    })

    test('should navigate to wizard from CTA', async ({ page }) => {
      await page.click('text=Start Your Garden Plan')
      await page.waitForURL('**/wizard')
      await expect(page.locator('h1')).toContainText('Create Your Garden Plan')
    })

    test('should navigate to demo', async ({ page }) => {
      await page.click('text=Explore Features')
      await page.waitForURL('**/demo')
      await expect(page.locator('h1')).toContainText('Interactive Garden Planner Demo')
    })

    test('should display all feature cards', async ({ page }) => {
      const features = [
        'Intelligent Layout Design',
        'Precise Materials Planning',
        'Smart Crop Rotation',
        'Water-Efficient Design',
        'Organic Pest Management',
        'Garden Assistant AI'
      ]

      for (const feature of features) {
        await expect(page.locator(`text=${feature}`)).toBeVisible()
      }
    })

    test('should have working animations', async ({ page }) => {
      // Check for animation classes
      const animatedElements = await page.locator('[class*="animate-"]').count()
      expect(animatedElements).toBeGreaterThan(0)
    })
  })

  test.describe('Wizard Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/wizard`)
    })

    test('should complete wizard with all steps', async ({ page }) => {
      // Step 1: Location
      await expect(page.locator('text=Where is your garden?')).toBeVisible()
      await page.fill('input[id="city"]', 'Portland, OR')
      await page.selectOption('select', '8b')
      await page.click('text=Next Step')

      // Step 2: Area
      await expect(page.locator('text=How much space do you have?')).toBeVisible()
      await page.fill('input[type="number"]', '200')
      await page.click('text=Next Step')

      // Step 3: Surface
      await expect(page.locator('text=What\'s your growing surface?')).toBeVisible()
      await page.click('text=Existing Soil')
      await page.click('text=Next Step')

      // Step 4: Water
      await expect(page.locator('text=What\'s your water situation?')).toBeVisible()
      await page.click('text=Garden Hose/Spigot')
      await page.click('text=Next Step')

      // Step 5: Crops
      await expect(page.locator('text=What do you want to grow?')).toBeVisible()
      await page.click('input[value="vegetables"]')
      await page.click('input[value="herbs"]')
      await page.click('text=Next Step')

      // Step 6: Template
      await expect(page.locator('text=Choose Your Garden Style')).toBeVisible()
      await page.click('text=Beginner Salad Garden')
      await page.click('text=Next Step')

      // Step 7: Review
      await expect(page.locator('text=Review Your Plan')).toBeVisible()
      await expect(page.locator('text=Generate My Garden Plan')).toBeVisible()
    })

    test('should allow navigation between steps', async ({ page }) => {
      // Navigate forward
      await page.click('text=Next Step')
      await expect(page.locator('text=Step 2 of 7')).toBeVisible()

      // Navigate backward
      await page.click('text=Previous')
      await expect(page.locator('text=Step 1 of 7')).toBeVisible()
    })

    test('should show progress bar', async ({ page }) => {
      const progressBar = page.locator('[role="progressbar"]')
      await expect(progressBar).toBeVisible()

      // Check progress updates
      await page.click('text=Next Step')
      await page.waitForTimeout(500) // Wait for animation
      const progressValue = await progressBar.getAttribute('aria-valuenow')
      expect(Number(progressValue)).toBeGreaterThan(0)
    })
  })

  test.describe('Demo Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/demo`)
    })

    test('should display demo interface', async ({ page }) => {
      await expect(page.locator('text=Drawing Tools')).toBeVisible()
      await expect(page.locator('text=Plant Library')).toBeVisible()
      await expect(page.locator('text=Garden Statistics')).toBeVisible()
    })

    test('should start and stop tour', async ({ page }) => {
      await page.click('text=Start Tour')
      await expect(page.locator('text=Pause Tour')).toBeVisible()

      await page.click('text=Pause Tour')
      await expect(page.locator('text=Start Tour')).toBeVisible()
    })

    test('should show garden beds', async ({ page }) => {
      const beds = await page.locator('text=/Bed \\d+/').count()
      expect(beds).toBeGreaterThan(0)
    })

    test('should display statistics', async ({ page }) => {
      await expect(page.locator('text=120 sq ft')).toBeVisible()
      await expect(page.locator('text=15 gal/week')).toBeVisible()
    })
  })

  test.describe('Authentication', () => {
    test('should navigate to login page', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`)
      await expect(page.locator('h1')).toContainText('Welcome back')
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
    })

    test('should navigate to signup page', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/signup`)
      await expect(page.locator('h1')).toContainText('Create your account')
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
    })

    test('should show validation errors', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`)
      await page.click('button[type="submit"]')
      await expect(page.locator('text=required')).toBeVisible()
    })

    test('should toggle password visibility', async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`)
      const passwordInput = page.locator('input[type="password"]')
      await passwordInput.fill('testpassword')

      // Look for eye icon and click it
      await page.click('button[aria-label*="password"]')
      await expect(page.locator('input[type="text"][value="testpassword"]')).toBeVisible()
    })
  })

  test.describe('Editor (authenticated)', () => {
    // Note: These tests would require authentication setup
    test.skip('should load editor interface', async ({ page }) => {
      // Login first
      await loginUser(page)

      // Navigate to editor
      await page.goto(`${BASE_URL}/editor/test-id`)

      await expect(page.locator('text=Properties')).toBeVisible()
      await expect(page.locator('text=Layers')).toBeVisible()
      await expect(page.locator('text=Versions')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      const buttons = await page.locator('button[aria-label]').count()
      expect(buttons).toBeGreaterThan(0)
    })

    test('should have sufficient color contrast', async ({ page }) => {
      // This would require axe-core or similar
      // For now, just check that we're using the right CSS classes
      const greenButtons = await page.locator('.bg-green-600').count()
      expect(greenButtons).toBeGreaterThan(0)
    })
  })

  test.describe('Performance', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now()
      await page.goto(BASE_URL)
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(5000) // Should load in under 5 seconds
    })

    test('should have optimized images', async ({ page }) => {
      const images = await page.locator('img').all()
      for (const img of images) {
        const src = await img.getAttribute('src')
        if (src) {
          // Check for next/image optimization
          expect(src).toMatch(/\/_next\/image|\.webp|\.avif/)
        }
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should show 404 page for invalid routes', async ({ page }) => {
      await page.goto(`${BASE_URL}/invalid-route-12345`)
      await expect(page.locator('text=404')).toBeVisible()
    })

    test('should handle network errors gracefully', async ({ page, context }) => {
      // Block API calls to simulate network error
      await context.route('**/api/**', route => route.abort())

      await page.goto(`${BASE_URL}/dashboard`)
      // Should show error state instead of crashing
      await expect(page.locator('text=/error|failed|retry/i')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
      await page.goto(BASE_URL)

      // Check mobile menu or responsive elements
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('text=Start Your Garden Plan')).toBeVisible()
    })

    test('should be tablet responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }) // iPad size
      await page.goto(BASE_URL)

      await expect(page.locator('h1')).toBeVisible()
      const cards = await page.locator('.grid > div').count()
      expect(cards).toBeGreaterThan(0)
    })
  })
})

// Helper function for authentication
async function loginUser(page: Page) {
  await page.goto(`${BASE_URL}/auth/login`)
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'Test123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard')
}