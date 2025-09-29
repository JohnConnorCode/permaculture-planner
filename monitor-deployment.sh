#!/bin/bash

# Automated Vercel Deployment Monitor
echo "🔍 Starting automated Vercel deployment monitoring..."
echo "Monitoring: https://permaculture-planner.vercel.app"
echo "Time: $(date)"
echo "---"

# Function to check site status
check_site() {
    local url=$1
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    echo "$response"
}

# Function to check for TypeScript errors in page
check_for_errors() {
    local url=$1
    local content=$(curl -s "$url" 2>/dev/null)

    # Check for common error patterns
    if echo "$content" | grep -q "TypeError\|ReferenceError\|SyntaxError\|Cannot read\|undefined is not"; then
        echo "ERROR"
    elif echo "$content" | grep -q "500 Internal Server Error\|404 Not Found\|Build Error"; then
        echo "BUILD_ERROR"
    else
        echo "OK"
    fi
}

# Monitor loop
MAX_CHECKS=30  # Check for up to 5 minutes (30 * 10 seconds)
CHECK_COUNT=0

while [ $CHECK_COUNT -lt $MAX_CHECKS ]; do
    CHECK_COUNT=$((CHECK_COUNT + 1))

    # Check main site
    MAIN_STATUS=$(check_site "https://permaculture-planner.vercel.app")
    DEMO_STATUS=$(check_site "https://permaculture-planner.vercel.app/demo")

    # Check for errors in content
    MAIN_ERRORS=$(check_for_errors "https://permaculture-planner.vercel.app")
    DEMO_ERRORS=$(check_for_errors "https://permaculture-planner.vercel.app/demo")

    echo "[Check #$CHECK_COUNT] $(date '+%H:%M:%S')"
    echo "  Main page: HTTP $MAIN_STATUS (Content: $MAIN_ERRORS)"
    echo "  Demo page: HTTP $DEMO_STATUS (Content: $DEMO_ERRORS)"

    # Success condition
    if [ "$MAIN_STATUS" = "200" ] && [ "$DEMO_STATUS" = "200" ] && \
       [ "$MAIN_ERRORS" = "OK" ] && [ "$DEMO_ERRORS" = "OK" ]; then
        echo ""
        echo "✅ DEPLOYMENT SUCCESSFUL!"
        echo "   - Main site: https://permaculture-planner.vercel.app ✓"
        echo "   - Demo page: https://permaculture-planner.vercel.app/demo ✓"
        echo "   - No TypeScript or build errors detected"
        echo "   - All systems operational"
        exit 0
    fi

    # Failure conditions
    if [ "$MAIN_STATUS" = "500" ] || [ "$DEMO_STATUS" = "500" ]; then
        echo ""
        echo "❌ DEPLOYMENT FAILED - Server Error"
        exit 1
    fi

    if [ "$MAIN_ERRORS" = "ERROR" ] || [ "$DEMO_ERRORS" = "ERROR" ]; then
        echo ""
        echo "⚠️  JavaScript errors detected - checking again..."
    fi

    # Wait before next check
    sleep 10
done

echo ""
echo "⏱️  Monitoring timeout reached. Please check Vercel dashboard manually."
exit 2