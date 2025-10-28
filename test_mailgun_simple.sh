#!/bin/bash

# Simple Mailgun Test
# Replace YOUR_API_KEY and YOUR_DOMAIN with your actual values

API_KEY="YOUR_API_KEY"
DOMAIN="YOUR_DOMAIN"

echo "=== MAILGUN API TEST ==="
echo "Testing API key and domain..."

# Test API key validity
response=$(curl -s -w "%{http_code}" -o /tmp/mailgun_response \
    --user "api:${API_KEY}" \
    "https://api.mailgun.net/v3/domains/${DOMAIN}")

http_code="${response: -3}"

echo "HTTP Status: $http_code"

if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS! Mailgun API is working"
    echo "Domain info:"
    cat /tmp/mailgun_response | jq '.' 2>/dev/null || cat /tmp/mailgun_response
else
    echo "❌ FAILED! Check your API key and domain"
    echo "Response:"
    cat /tmp/mailgun_response
fi

rm -f /tmp/mailgun_response

echo ""
echo "=== QUICK TEST COMMANDS ==="
echo "To test with your credentials, run:"
echo "API_KEY='your_key_here' DOMAIN='your_domain_here' ./test_mailgun_simple.sh"
