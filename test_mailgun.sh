#!/bin/bash

# Mailgun Configuration Test Script
# Run this in your production environment

echo "=== MAILGUN CONFIGURATION TEST ==="
echo ""

# Check environment variables
echo "Checking environment variables..."
echo "MAILER_ADAPTER: ${MAILER_ADAPTER:-NOT SET}"
echo "MAILGUN_API_KEY: ${MAILGUN_API_KEY:+SET (${#MAILGUN_API_KEY} chars)}"
echo "MAILGUN_API_KEY: ${MAILGUN_API_KEY:-NOT SET}"
echo "DOMAIN: ${DOMAIN:-NOT SET}"
echo "FROM_ADDRESS: ${FROM_ADDRESS:-NOT SET}"
echo ""

# Validate configuration
if [ "$MAILER_ADAPTER" != "Swoosh.Adapters.Mailgun" ]; then
    echo "❌ ERROR: MAILER_ADAPTER must be set to 'Swoosh.Adapters.Mailgun'"
    echo "   Current value: ${MAILER_ADAPTER:-NOT SET}"
    exit 1
fi

if [ -z "$MAILGUN_API_KEY" ]; then
    echo "❌ ERROR: MAILGUN_API_KEY is required"
    exit 1
fi

if [ -z "$DOMAIN" ]; then
    echo "❌ ERROR: DOMAIN is required"
    exit 1
fi

echo "✅ Configuration looks good!"
echo ""

# Test Mailgun API directly
echo "=== TESTING MAILGUN API ==="
echo "Testing API key validity..."

# Test API key with a simple request
response=$(curl -s -w "%{http_code}" -o /tmp/mailgun_test_response \
    --user "api:${MAILGUN_API_KEY}" \
    "https://api.mailgun.net/v3/domains/${DOMAIN}")

http_code="${response: -3}"

if [ "$http_code" = "200" ]; then
    echo "✅ Mailgun API key is valid!"
    echo "✅ Domain '${DOMAIN}' is accessible"
    
    # Check domain status
    domain_status=$(cat /tmp/mailgun_test_response | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
    echo "Domain state: ${domain_status}"
    
    if [ "$domain_status" = "active" ]; then
        echo "✅ Domain is active and ready to send emails!"
    else
        echo "⚠️  Domain state: ${domain_status}"
        echo "   You may need to verify your domain in Mailgun dashboard"
    fi
    
else
    echo "❌ Mailgun API test failed!"
    echo "HTTP Status: $http_code"
    echo "Response:"
    cat /tmp/mailgun_test_response
    echo ""
    echo "Common issues:"
    echo "- Invalid API key"
    echo "- Domain not found"
    echo "- API key doesn't have access to this domain"
fi

rm -f /tmp/mailgun_test_response

echo ""
echo "=== NEXT STEPS ==="
echo "1. If API test passed, test password reset functionality"
echo "2. Check Mailgun dashboard for delivery logs"
echo "3. Monitor application logs for email delivery status"
echo "4. Test with a real email address"

echo ""
echo "=== TEST PASSWORD RESET ==="
echo "To test password reset emails:"
echo "1. Go to your login page"
echo "2. Click 'Forgot Password'"
echo "3. Enter your email address"
echo "4. Check your inbox (and spam folder)"
echo "5. Check Mailgun dashboard for delivery status"
