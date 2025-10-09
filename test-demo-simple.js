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
      console.log('❌ Console error:', msg.text());
    }
  });

  // Track page crashes
  page.on('crash', () => {
    console.error('❌ Page crashed!');
    process.exit(1);
  });

  try {
    console.log('📍 Navigating to demo page...');
    await page.goto('http://localhost:3000/demo', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully');

    // Wait a bit to see if any runtime errors occur
    await page.waitForTimeout(2000);

    // Check for errors
    if (errors.length > 0) {
      console.error('❌ Console errors detected:', errors.length, 'errors');
      process.exit(1);
    }

    console.log('✅ No errors detected - Demo page is working!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();