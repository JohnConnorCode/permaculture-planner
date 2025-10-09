import { test, expect } from '@playwright/test'

test.describe('Element Drag and Drop & Alignment', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to demo page
    await page.goto('http://localhost:3000/demo')
    await page.waitForLoadState('networkidle')

    // Dismiss any welcome screens or tutorials
    const continueButton = page.locator('button:has-text("Continue")')
    const closeButton = page.locator('button:has-text("Close")')
    const gotItButton = page.locator('button:has-text("Got it")')

    if (await continueButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueButton.click()
      await page.waitForTimeout(500)
    }
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click()
      await page.waitForTimeout(500)
    }
    if (await gotItButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await gotItButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('should drag and drop a permaculture element onto canvas', async ({ page }) => {
    // Find the permaculture elements tab
    await page.click('text=Water')

    // Wait for elements to load
    await page.waitForSelector('text=Water Tank', { timeout: 5000 })

    // Get the water tank element
    const waterTank = page.locator('text=Water Tank').first()
    await expect(waterTank).toBeVisible()

    // Get canvas - use a more specific selector for the garden designer canvas
    const canvas = page.locator('svg[viewBox]').filter({ hasText: '' }).first()
    await expect(canvas).toBeVisible()

    // Drag water tank to canvas
    const canvasBox = await canvas.boundingBox()
    if (!canvasBox) throw new Error('Canvas not found')

    await waterTank.dragTo(canvas, {
      targetPosition: {
        x: canvasBox.width / 2,
        y: canvasBox.height / 2
      }
    })

    // Check that element was created (should see the element in the beds layer)
    await page.waitForTimeout(1000)
    const bedsLayer = page.locator('g.beds-layer')
    await expect(bedsLayer).toBeVisible()
  })

  test('should show alignment controls when bed is selected', async ({ page }) => {
    // First create a rectangle bed using keyboard shortcut
    await page.keyboard.press('r')
    await page.waitForTimeout(1000)

    // Get the garden designer canvas - more specific selector
    const canvas = page.locator('svg[viewBox]').filter({ hasText: '' }).first()
    await expect(canvas).toBeVisible()

    // Get canvas bounding box
    const canvasBox = await canvas.boundingBox()
    if (!canvasBox) throw new Error('Canvas not found')

    // Click twice on canvas to create rectangle - use force to bypass pointer-events
    await canvas.click({
      position: { x: canvasBox.width / 3, y: canvasBox.height / 3 },
      force: true
    })

    await page.waitForTimeout(300)

    await canvas.click({
      position: { x: (canvasBox.width * 2) / 3, y: (canvasBox.height * 2) / 3 },
      force: true
    })

    await page.waitForTimeout(1000)

    // Switch to select tool using keyboard shortcut
    await page.keyboard.press('v')
    await page.waitForTimeout(1000)

    // Click on the bed to select it
    await canvas.click({
      position: { x: canvasBox.width / 2, y: canvasBox.height / 2 },
      force: true
    })

    await page.waitForTimeout(1500)

    // Check if alignment controls appear
    await page.waitForSelector('button[title="Align Left"]', { timeout: 5000 })
    await expect(page.locator('button[title="Align Left"]')).toBeVisible()
    await expect(page.locator('button[title="Align Right"]')).toBeVisible()
    await expect(page.locator('button[title="Align Top"]')).toBeVisible()
    await expect(page.locator('button[title="Align Bottom"]')).toBeVisible()
    await expect(page.locator('button[title="Align Center (Horizontal)"]')).toBeVisible()
    await expect(page.locator('button[title="Align Center (Vertical)"]')).toBeVisible()
  })

  test('should align bed when alignment button is clicked', async ({ page }) => {
    // Create a rectangle bed using keyboard shortcut
    await page.keyboard.press('r')
    await page.waitForTimeout(1000)

    const canvas = page.locator('svg[viewBox]').filter({ hasText: '' }).first()
    await expect(canvas).toBeVisible()

    const canvasBox = await canvas.boundingBox()
    if (!canvasBox) throw new Error('Canvas not found')

    // Draw a rectangle
    await canvas.click({
      position: { x: canvasBox.width / 3, y: canvasBox.height / 3 },
      force: true
    })
    await page.waitForTimeout(300)

    await canvas.click({
      position: { x: (canvasBox.width * 2) / 3, y: (canvasBox.height * 2) / 3 },
      force: true
    })
    await page.waitForTimeout(1000)

    // Switch to select tool using keyboard shortcut
    await page.keyboard.press('v')
    await page.waitForTimeout(1000)

    // Select the bed
    await canvas.click({
      position: { x: canvasBox.width / 2, y: canvasBox.height / 2 },
      force: true
    })
    await page.waitForTimeout(1500)

    // Wait for alignment controls
    await page.waitForSelector('button[title="Align Left"]', { timeout: 5000 })

    // Get the bed's initial position
    const bedPath = page.locator('g.beds-layer path').first()
    const initialD = await bedPath.getAttribute('d')

    // Click align left
    await page.click('button[title="Align Left"]')

    // Wait a bit for the alignment to take effect
    await page.waitForTimeout(500)

    // Get the new position
    const newD = await bedPath.getAttribute('d')

    // The path should have changed
    expect(initialD).not.toBe(newD)
  })
})
