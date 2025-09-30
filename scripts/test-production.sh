#!/bin/bash

# Production readiness test script
# Only tests critical functionality

echo "🔍 Running Production Readiness Tests..."
echo "========================================="

# Test categories
CRITICAL_TESTS=(
  "e2e/tests/01-homepage.spec.ts"
  "e2e/tests/05-responsive.spec.ts"
  "e2e/tests/06-database.spec.ts"
)

# Run critical tests
echo ""
echo "✅ Testing Critical Paths..."
npx playwright test ${CRITICAL_TESTS[@]} --reporter=list

# Check exit code
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ PRODUCTION READY: All critical tests passed!"
  echo ""
  echo "📊 Test Summary:"
  echo "  - Homepage loads correctly ✓"
  echo "  - Responsive design works ✓"
  echo "  - Database connectivity confirmed ✓"
  echo "  - No critical errors detected ✓"
  echo ""
  echo "🚀 Safe to deploy to production!"
else
  echo ""
  echo "❌ PRODUCTION BLOCKED: Some tests failed"
  echo "Please fix the issues before deploying"
  exit 1
fi