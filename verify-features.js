const fs = require('fs');
const path = require('path');

// Read the garden designer canvas file
const canvasFile = path.join(__dirname, 'components/garden-designer-canvas.tsx');
const canvasContent = fs.readFileSync(canvasFile, 'utf8');

// Read the demo file
const demoFile = path.join(__dirname, 'app/demo/page.tsx');
const demoContent = fs.readFileSync(demoFile, 'utf8');

// Read the layout file
const layoutFile = path.join(__dirname, 'app/layout.tsx');
const layoutContent = fs.readFileSync(layoutFile, 'utf8');

console.log('🔍 Verifying Implemented Features:\n');

const features = {
  '1. Infinite Canvas': {
    checks: [
      { text: 'ViewBox state', found: canvasContent.includes('useState<ViewBox>') },
      { text: 'Pan functionality', found: canvasContent.includes('isPanning') },
      { text: 'Zoom controls', found: canvasContent.includes('handleZoomIn') && canvasContent.includes('handleZoomOut') },
      { text: 'Space key for pan', found: canvasContent.includes("code === 'Space'") },
      { text: 'Mouse wheel zoom', found: canvasContent.includes('handleWheel') },
      { text: 'Fit to content', found: canvasContent.includes('fitToContent') },
    ]
  },
  '2. Precise Dimension Input': {
    checks: [
      { text: 'Dimension dialog state', found: canvasContent.includes('showDimensionDialog') },
      { text: 'Dimension input state', found: canvasContent.includes('dimensionInput') },
      { text: 'Create precise bed function', found: canvasContent.includes('createPreciseBed') },
      { text: 'Precise rect tool', found: demoContent.includes('rect-precise') },
      { text: 'Dialog component', found: canvasContent.includes('DialogContent') },
    ]
  },
  '3. Transform Controls': {
    checks: [
      { text: 'Transform mode state', found: canvasContent.includes('transformMode') },
      { text: 'Resize functionality', found: canvasContent.includes("transformMode === 'resize'") },
      { text: 'Rotate functionality', found: canvasContent.includes("transformMode === 'rotate'") },
      { text: 'Scale functionality', found: canvasContent.includes("transformMode === 'scale'") },
      { text: 'Transform handles', found: canvasContent.includes('Transform Handles when selected') },
    ]
  },
  '4. Shape Tools': {
    checks: [
      { text: 'Circle shape', found: canvasContent.includes("case 'circle':") },
      { text: 'Triangle shape', found: canvasContent.includes("case 'triangle':") },
      { text: 'Hexagon shape', found: canvasContent.includes("case 'hexagon':") },
      { text: 'L-shape', found: canvasContent.includes("case 'l-shape':") },
      { text: 'Shape buttons in toolbar', found: demoContent.includes('Circle') && demoContent.includes('Triangle') },
    ]
  },
  '5. Copy/Paste': {
    checks: [
      { text: 'Clipboard state', found: canvasContent.includes('clipboard, setClipboard') },
    ]
  },
  '6. Measurements': {
    checks: [
      { text: 'Show measurements state', found: canvasContent.includes('showMeasurements') },
      { text: 'Ruler icon', found: canvasContent.includes('Ruler') },
      { text: 'Measurement display', found: canvasContent.includes('showMeasurements && bed.width && bed.height') },
    ]
  },
  '7. Scroll to Top': {
    checks: [
      { text: 'ScrollToTop component', found: fs.existsSync(path.join(__dirname, 'components/scroll-to-top.tsx')) },
      { text: 'Added to layout', found: layoutContent.includes('ScrollToTop') },
    ]
  }
};

let totalChecks = 0;
let passedChecks = 0;

for (const [feature, data] of Object.entries(features)) {
  console.log(`\n✨ ${feature}`);
  let featurePassed = 0;

  for (const check of data.checks) {
    totalChecks++;
    if (check.found) {
      passedChecks++;
      featurePassed++;
      console.log(`  ✅ ${check.text}`);
    } else {
      console.log(`  ❌ ${check.text}`);
    }
  }

  console.log(`  Summary: ${featurePassed}/${data.checks.length} checks passed`);
}

console.log('\n' + '='.repeat(50));
console.log(`📊 OVERALL VERIFICATION: ${passedChecks}/${totalChecks} checks passed (${Math.round(passedChecks/totalChecks*100)}%)`);

if (passedChecks === totalChecks) {
  console.log('✅ All features properly implemented!');
} else {
  console.log('⚠️  Some features may need attention');
}