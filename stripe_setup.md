Backend Implementation: Login Authentication with Subscription Validation
Objective
Enforce that users can only log into app.netia.ai if they have an active subscription (active or trialing). Block access for canceled, expired, or unpaid subscriptions.
Required Endpoint: POST /api/login
Request Format:
{
  "email": "user@example.com",
  "password": "password123"
}
Success Response (200):
{
  "data": {
    "token": "eyJhbGci...",
    "renew_token": "eyJhbGci...",
    "subscription": {
      "status": "active" | "trialing",
      "trial_end": "2024-01-15T00:00:00Z",
      "current_period_end": "2024-01-22T00:00:00Z"
    }
  }
}
Error Response - No Active Subscription (403):
{
  "error": {
    "status": 403,
    "message": "No active subscription. Please update your payment method.",
    "subscription_status": "canceled" | "past_due" | "expired",
    "action_required": "update_payment"
  }
}
Error Response - Invalid Credentials (401):
{
  "error": {
    "status": 401,
    "message": "Invalid email or password"
  }
}
Implementation Logic
Validate Credentials
Authenticate email/password
Return 401 if invalid
Check Subscription Status
Query Stripe API for user's subscription
import stripe

stripe_subscription = stripe.Subscription.list(
    customer=user.stripe_customer_id,
    status="all",
    limit=1
).data[0] if user.stripe_customer_id else None
Link: User → Stripe Customer ID → Stripe Subscription
Determine subscription status
Allow Login If:
status: "active" - Paid subscription active
status: "trialing" - Within 7-day trial period
Optional: status: "past_due" - Allow grace period (your choice)
Block Login If:
status: "canceled" - Subscription canceled
status: "unpaid" - Payment failed
Trial expired with no active subscription
No subscription found
Return Response
Include subscription details in success response
Include helpful error messages for blocked access
Stripe Integration
Query Stripe Subscription:
Protected Routes Middleware
Also implement middleware for authenticated routes:
Validate token on every protected API call
Check subscription status on each request
Return 403 if subscription inactive
Do not rely on client-side checks
Key Points
Security: Backend validates subscription; frontend cannot bypass
User Experience: Clear error messages guide users to fix subscription issues
Integration: Works with Stripe subscription status automatically
Extensibility: Easy to add grace periods or different handling for past_due status