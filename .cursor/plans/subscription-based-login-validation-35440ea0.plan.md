<!-- 35440ea0-c373-43aa-bdfd-f2cc0dcb8895 f8d8440c-8afb-4ebe-9a12-bead69bab4bb -->
# Subscription-Based Login Validation

## Overview

Enforce that users can only log into app.netia.ai if they have an active subscription (active or trialing). Frontend handles Stripe customer/subscription creation via Stripe.js and sends IDs to backend for storage. Backend validates subscription status at login/renewal time by querying Stripe API. Block access for canceled, expired, unpaid, or past_due subscriptions.

## Implementation Steps

### 1. Add API Endpoint to Store Stripe IDs

**File:** `lib/chat_api_web/controllers/stripe_controller.ex` (new file)

- Create new `StripeController` module:
  - Add `link/2` action that:
    - Requires authentication (use `api_protected` pipeline)
    - Accepts request body: `%{"account_id" => account_id, "stripe_customer_id" => customer_id, "stripe_subscription_id" => subscription_id}`
    - Validates that `account_id` is present
    - Validates that authenticated user has access to the account (user.account_id == account_id)
    - Loads account using `Accounts.get_account!(account_id)`
    - Updates account using `Accounts.update_billing_info/2` with Stripe IDs
    - Returns success response with updated account

**File:** `lib/chat_api_web/router.ex`

- Add route: `post("/stripe/link", StripeController, :link)` to `api_protected` pipeline

### 2. Create Subscription Validation Module

**File:** `lib/chat_api/subscriptions.ex` (new file)

- Add `check_subscription_status/1` function that:
  - Takes an Account struct (assumes `stripe_customer_id` exists)
  - Queries Stripe API using `Stripe.Subscription.list(customer: customer_id, status: "all", limit: 1)` to get latest subscription
  - Returns `{:ok, subscription}` or `{:error, reason}` if no subscription found
- Add `subscription_allows_login?/1` function that:
  - Takes subscription or nil
  - Allows login if status is `"active"` or `"trialing"`
  - Blocks login if status is `"canceled"`, `"unpaid"`, `"past_due"`, or nil
  - Returns `{allowed: boolean, status: string | nil, reason: string | nil}`

### 3. Update Session Controller Login

**File:** `lib/chat_api_web/controllers/session_controller.ex`

- Modify `create/2` function:
  - After authentication succeeds and `EnsureUserEnabledPlug` passes, load account using `Accounts.get_account!(conn.assigns.current_user.account_id)`
  - Validate account has `stripe_customer_id` (return 403 if missing)
  - Call `ChatApi.Subscriptions.check_subscription_status(account)` to get subscription
  - Call `ChatApi.Subscriptions.subscription_allows_login?(subscription)` to check if login allowed
  - If subscription allows login:
    - Include subscription details in success response:
      ```elixir
      %{
        subscription: %{
          status: subscription.status,
          trial_end: subscription.trial_end,
          current_period_end: subscription.current_period_end
        }
      }
      ```

  - If subscription blocks login:
    - Return 403 error with:
      ```elixir
      %{
        error: %{
          status: 403,
          message: "No active subscription. Please update your payment method.",
          subscription_status: status,
          action_required: "update_payment"
        }
      }
      ```

  - Handle Stripe API errors: Log error and return 403 (fail secure)

### 4. Update Session Controller Renew

**File:** `lib/chat_api_web/controllers/session_controller.ex`

- Modify `renew/2` function:
  - After token renewal succeeds and `EnsureUserEnabledPlug` passes, load account
  - Validate account has `stripe_customer_id` (return 403 if missing)
  - Check subscription status using same logic as login
  - Return 403 if subscription is inactive
  - Return success with subscription details if active

### 5. Handle Edge Cases

- Accounts without `stripe_customer_id`: Block login (return 403)
- Accounts without Stripe subscription: Block login (return 403)
- Stripe API errors: Log error and block login (fail secure)
- Handle trial periods that may have expired (check `trial_end` date)

### 6. Update Frontend Types

**File:** `assets/src/types.ts`

- Add subscription fields to login response type:
  ```typescript
  subscription?: {
    status: "active" | "trialing";
    trial_end?: string;
    current_period_end?: string;
  }
  ```


### 7. Update Frontend Auth Handling

**File:** `assets/src/components/auth/AuthProvider.tsx`

- Handle 403 responses from login/renew
- Check if error has `subscription_status` field
- If subscription error, redirect to `/billing` or show subscription error message
- Update login function to handle subscription in response

### 8. Frontend API Function (Not Needed)

**Note:** The Next.js frontend (`app/api/stripe/link/route.ts`) handles calling the backend endpoint directly. No changes needed to `assets/src/api.ts`.

## Technical Considerations

- **Stripe API Calls**: Query Stripe directly at login/renewal time only (no caching needed)
- **Error Handling**: Always fail secure (block access) if Stripe API fails or subscription is invalid
- **Assumptions**: All accounts must have `stripe_customer_id` (validation happens at login)
- **Status Values**: Block `"canceled"`, `"unpaid"`, `"past_due"`, and nil. Allow only `"active"` and `"trialing"`
- **Frontend Responsibility**: Frontend handles Stripe customer/subscription creation and sends IDs to backend via API

## Files to Modify

1. `lib/chat_api_web/controllers/account_controller.ex` (add `update_billing` action)
2. `lib/chat_api_web/router.ex` (add billing route)
3. `lib/chat_api/subscriptions.ex` (new)
4. `lib/chat_api_web/controllers/session_controller.ex`
5. `assets/src/types.ts`
6. `assets/src/components/auth/AuthProvider.tsx`
7. `assets/src/api.ts` (add `updateAccountBilling` function)

### To-dos

- [ ] Create ChatApi.Subscriptions module with check_subscription_status and subscription_allows_login? functions
- [ ] Update SessionController.create/2 to check subscription status after authentication
- [ ] Update SessionController.renew/2 to check subscription status after token renewal
- [ ] Create EnsureSubscriptionActivePlug to check subscription on protected routes
- [ ] Add EnsureSubscriptionActivePlug to api_protected pipeline in router.ex
- [ ] Update TypeScript types to include subscription in login response
- [ ] Update AuthProvider to handle 403 subscription errors and redirect to billing