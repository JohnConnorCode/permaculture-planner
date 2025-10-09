const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing demo page...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Track console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Track page crashes
  page.on('crash', () => {
    console.error('❌ Page crashed!');
    process.exit(1);
  });

  try {
    console.log('📍 Navigating to demo page...');
    await page.goto('http://localhost:3000/demo', { waitUntil: 'networkidle' });

    console.log('✅ Page loaded successfully');

    // Test drawing tool interactions
    console.log('🎨 Testing drawing tools...');
    await page.click('#drawing-tools button[title*="Rectangle"]');
    await page.waitForTimeout(500);

    // Test canvas interactions
    console.log('🖱️ Testing canvas interactions...');
    const canvas = await page.$('#canvas-svg');
    if (!canvas) {
      throw new Error('Canvas not found!');
    }

    // Simulate drawing a rectangle
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 200, box.y + 200);
      await page.mouse.up();
      await page.waitForTimeout(500);
    }

    // Test plant selection
    console.log('🌱 Testing plant selection...');
    const plantButton = await page.$('#plant-library button:first-of-type');
    if (plantButton) {
      await plantButton.click();
      await page.waitForTimeout(500);
    }

    // Test view controls
    console.log('🔍 Testing view controls...');
    const zoomInButton = await page.$('#view-controls button[title*="Grid"]');
    if (zoomInButton) {
      await zoomInButton.click();
      await page.waitForTimeout(500);
    }

    // Check for errors
    if (errors.length > 0) {
      console.error('❌ Console errors detected:');
      errors.forEach(err => console.error('  ', err));
      process.exit(1);
    }

    console.log('✅ All tests passed! Demo page is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();