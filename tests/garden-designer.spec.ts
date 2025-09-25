import { test, expect } from '@playwright/test'

test.describe('Garden Designer Canvas - Enhanced Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page which has the garden designer
    await page.goto('/demo')
    await page.waitForLoadState('networkidle')
  })

  test('infinite canvas with pan and zoom', async ({ page }) => {
    // Get the canvas element
    const canvas = page.locator('svg').first()
    await expect(canvas).toBeVisible()

    // Test zoom in button
    await page.click('button[title="Zoom In"]')
    await page.waitForTimeout(100)

    // Test zoom out button
    await page.click('button[title="Zoom Out"]')
    await page.waitForTimeout(100)

    // Test keyboard zoom (Ctrl +)
    await page.keyboard.down('Control')
    await page.keyboard.press('Equal')
    await page.keyboard.up('Control')
    await page.waitForTimeout(100)

    // Test pan with Space key
    await page.keyboard.down('Space')
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100)
      await page.mouse.up()
    }
    await page.keyboard.up('Space')

    // Test fit to content button
    await page.click('button[title="Fit to Content"]')
    await page.waitForTimeout(100)

    // Test reset view button
    await page.click('button[title="Reset View"]')
    await page.waitForTimeout(100)

    // Verify zoom percentage is displayed
    await expect(page.locator('.font-mono').filter({ hasText: '%' })).toBeVisible()
  })

  test('precise dimension input for beds', async ({ page }) => {
    // Click the Precise Rect tool
    await page.click('button:has-text("Precise Rect")')

    // Click on canvas to trigger dimension dialog
    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.click('svg', { position: { x: 200, y: 200 } })
    }

    // Wait for dimension dialog
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Set Bed Dimensions')).toBeVisible()

    // Enter custom dimensions
    await page.fill('input#width', '6')
    await page.fill('input#height', '12')

    // Verify area calculation
    await expect(page.getByText('Area: 72.0 sq ft')).toBeVisible()

    // Create the bed
    await page.click('button:has-text("Create Bed")')

    // Verify dialog closes
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Toggle measurements display
    await page.click('button[title="Toggle Measurements"]')
    await page.waitForTimeout(100)

    // Verify measurements are shown on beds
    await expect(page.locator('text="6ft"')).toBeVisible()
    await expect(page.locator('text="12ft"')).toBeVisible()
  })

  test('transform controls for resize, rotate, and scale', async ({ page }) => {
    // First create a bed using rectangle tool
    await page.click('button:has-text("Rectangle")')

    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      // Draw a rectangle
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.down()
      await page.mouse.move(box.x + 200, box.y + 200)
      await page.mouse.up()
    }

    // Switch to select tool
    await page.click('button:has-text("Select")')

    // Click on the bed to select it
    await page.click('path[fill="#e0f2e0"]', { force: true })

    // Verify transform handles appear
    await expect(page.locator('circle[stroke="#3b82f6"]').first()).toBeVisible()

    // Test resize handle (corner)
    const resizeHandle = page.locator('circle[stroke="#3b82f6"]').first()
    await resizeHandle.hover()
    await page.mouse.down()
    await page.mouse.move(150, 150, { steps: 5 })
    await page.mouse.up()

    // Test rotation handle
    const rotateHandle = page.locator('circle[stroke="#3b82f6"]').nth(4)
    if (await rotateHandle.isVisible()) {
      await rotateHandle.hover()
      await page.mouse.down()
      await page.mouse.move(200, 50, { steps: 5 })
      await page.mouse.up()
    }

    // Test scale handle (green square)
    const scaleHandle = page.locator('rect[stroke="#10b981"]')
    if (await scaleHandle.isVisible()) {
      await scaleHandle.hover()
      await page.mouse.down()
      await page.mouse.move(250, 250, { steps: 5 })
      await page.mouse.up()
    }
  })

  test('drawing tools work correctly', async ({ page }) => {
    // Test freehand drawing
    await page.click('button:has-text("Custom Shape")')

    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + 50, box.y + 50)
      await page.mouse.down()

      // Draw a curved path
      for (let i = 1; i <= 10; i++) {
        await page.mouse.move(box.x + 50 + i * 10, box.y + 50 + Math.sin(i) * 20)
      }

      await page.mouse.up()
    }

    // Verify bed was created
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(1)
  })

  test('plant placement works', async ({ page }) => {
    // First create a bed
    await page.click('button:has-text("Rectangle")')
    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.down()
      await page.mouse.move(box.x + 300, box.y + 200)
      await page.mouse.up()
    }

    // Select a plant from the library
    await page.click('text="Vegetables"')
    await page.click('button:has-text("Tomato")')

    // Tool should auto-switch to plant mode
    await expect(page.locator('button:has-text("Plant")[aria-pressed="true"]')).toBeVisible()

    // Place the plant in the bed
    if (box) {
      await page.click('svg', { position: { x: 200, y: 150 } })
    }

    // Verify plant was placed
    await expect(page.locator('image[href*="tomato"]')).toBeVisible()
  })

  test('delete tool works', async ({ page }) => {
    // Create a bed first
    await page.click('button:has-text("Rectangle")')
    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.down()
      await page.mouse.move(box.x + 200, box.y + 200)
      await page.mouse.up()
    }

    // Switch to delete tool
    await page.click('button:has-text("Delete")')

    // Click on the bed to delete it
    await page.click('path[fill="#f0fdf4"]', { force: true })

    // Confirm deletion in dialog
    page.on('dialog', dialog => dialog.accept())

    // Verify bed was deleted
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(0)
  })

  test('grid toggle works', async ({ page }) => {
    // Toggle grid off
    await page.click('button:has-text("Grid")')
    await expect(page.locator('.grid-layer')).not.toBeVisible()

    // Toggle grid on
    await page.click('button:has-text("Grid")')
    await expect(page.locator('.grid-layer')).toBeVisible()
  })

  test('labels toggle works', async ({ page }) => {
    // Create a bed first
    await page.click('button:has-text("Rectangle")')
    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.down()
      await page.mouse.move(box.x + 200, box.y + 200)
      await page.mouse.up()
    }

    // Toggle labels off
    await page.click('button:has-text("Labels")')
    await expect(page.locator('text="Bed 1"')).not.toBeVisible()

    // Toggle labels on
    await page.click('button:has-text("Labels")')
    await expect(page.locator('text="Bed 1"')).toBeVisible()
  })

  test('undo/redo functionality', async ({ page }) => {
    // Create a bed
    await page.click('button:has-text("Rectangle")')
    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100)
      await page.mouse.down()
      await page.mouse.move(box.x + 200, box.y + 200)
      await page.mouse.up()
    }

    // Verify bed exists
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(1)

    // Undo (Ctrl+Z)
    await page.keyboard.down('Control')
    await page.keyboard.press('z')
    await page.keyboard.up('Control')

    // Verify bed was removed
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(0)

    // Redo (Ctrl+Shift+Z)
    await page.keyboard.down('Control')
    await page.keyboard.down('Shift')
    await page.keyboard.press('z')
    await page.keyboard.up('Shift')
    await page.keyboard.up('Control')

    // Verify bed was restored
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(1)
  })

  test('keyboard shortcuts work', async ({ page }) => {
    // Test 'S' for select tool
    await page.keyboard.press('s')
    await expect(page.locator('button:has-text("Select")[aria-pressed="true"]')).toBeVisible()

    // Test 'R' for rectangle tool
    await page.keyboard.press('r')
    await expect(page.locator('button:has-text("Rectangle")[aria-pressed="true"]')).toBeVisible()

    // Test 'D' for draw tool
    await page.keyboard.press('d')
    await expect(page.locator('button:has-text("Custom Shape")[aria-pressed="true"]')).toBeVisible()

    // Test 'Delete' for delete tool
    await page.keyboard.press('Delete')
    await expect(page.locator('button:has-text("Delete")[aria-pressed="true"]')).toBeVisible()
  })
})

test.describe('Garden Designer Mobile Responsiveness', () => {
  test('works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/demo')
    await page.waitForLoadState('networkidle')

    // Verify canvas is visible
    const canvas = page.locator('svg').first()
    await expect(canvas).toBeVisible()

    // Verify tools are accessible (may be in a dropdown on mobile)
    await expect(page.locator('button').first()).toBeVisible()

    // Test touch interactions
    const box = await canvas.boundingBox()
    if (box) {
      // Simulate touch drag
      await page.touchscreen.tap(box.x + 50, box.y + 50)
    }
  })
})

test.describe('Garden Designer Performance', () => {
  test('handles multiple beds efficiently', async ({ page }) => {
    await page.goto('/demo')
    await page.waitForLoadState('networkidle')

    // Create multiple beds quickly
    await page.click('button:has-text("Rectangle")')

    const canvas = page.locator('svg').first()
    const box = await canvas.boundingBox()

    if (box) {
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(box.x + i * 30, box.y + 50)
        await page.mouse.down()
        await page.mouse.move(box.x + i * 30 + 25, box.y + 100)
        await page.mouse.up()
      }
    }

    // Verify all beds were created
    await expect(page.locator('path[fill="#f0fdf4"]')).toHaveCount(10)

    // Test that interactions remain smooth
    await page.click('button:has-text("Select")')
    await page.click('path[fill="#f0fdf4"]').first()

    // Should select without lag
    await expect(page.locator('circle[stroke="#3b82f6"]').first()).toBeVisible({ timeout: 1000 })
  })
})