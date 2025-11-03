# API & Integration Guide

## API Overview

Netia provides a RESTful JSON API and WebSocket channels for real-time communication. The API supports both authenticated (agent) and unauthenticated (customer widget) use cases.

## API Structure

### Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://app.netia.io`

### Endpoints

```mermaid
graph TB
    subgraph "Public API"
        Public[Public Endpoints<br/>No Auth Required]
        Widget[Widget API<br/>Customer-facing]
        Webhooks[Webhooks<br/>External Services]
    end
    
    subgraph "Protected API"
        Auth[Protected Endpoints<br/>Require Token]
        Admin[Admin Endpoints<br/>Admin Role]
    end
    
    subgraph "WebSocket"
        Channels[Phoenix Channels<br/>Real-time]
    end
    
    Public --> Widget
    Public --> Webhooks
    Auth --> Admin
    Channels --> Widget
    Channels --> Auth
```

### Public Endpoints

**Customer/Widget**:
- `POST /api/customers` - Create customer
- `POST /api/conversations` - Create conversation
- `POST /api/messages` - Send message
- `GET /api/widget_settings` - Get widget config

**Webhooks**:
- `POST /api/slack/webhook` - Slack events
- `POST /api/twilio/webhook` - Twilio SMS
- `POST /api/github/webhook` - GitHub events
- `POST /api/ses/webhook` - AWS SES emails
- `POST /api/stripe/webhooks` - Stripe billing

### Protected Endpoints

**Authentication**:
- `POST /api/registration` - Create account
- `POST /api/session` - Login
- `DELETE /api/session` - Logout
- `GET /api/me` - Current user

**Conversations**:
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation
- `PUT /api/conversations/:id` - Update conversation
- `POST /api/conversations/:id/archive` - Archive
- `POST /api/conversations/:id/share` - Share conversation

**Messages**:
- `GET /api/messages` - List messages
- `POST /api/messages` - Create message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

**Customers**:
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer

## Authentication

### Agent Authentication

**Session-Based**:
```http
POST /api/session
Content-Type: application/json

{
  "user": {
    "email": "agent@example.com",
    "password": "password"
  }
}
```

**Response**:
```json
{
  "user": {
    "id": 1,
    "email": "agent@example.com",
    "account_id": "...",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Using Token**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key Authentication

**Personal API Keys**:
- Created in user settings
- Long-lived tokens for API access
- Format: `Bearer {api_key}`

### Widget Authentication

**Customer Identification**:
```javascript
// Optional: Identify returning customer
POST /api/customers/identify
{
  "email": "customer@example.com",
  "name": "John Doe",
  "external_id": "123"
}
```

**Anonymous**: Widget works without customer identification (auto-creates customer)

## WebSocket API

### Connection

```javascript
import { Socket } from "phoenix"

const socket = new Socket("/socket", {
  params: { token: userToken }  // Optional for authenticated users
})
socket.connect()
```

### Channels

**Conversation Channel**:
```javascript
const channel = socket.channel(`conversation:${conversationId}`, {
  customer_id: customerId  // For customer widgets
})
channel.join()
```

**Notification Channel** (Agents):
```javascript
const channel = socket.channel(`notification:${accountId}`, {})
channel.join()
```

### Channel Events

**Outgoing**:
- `shout` - Send message
- `typing` - Typing indicator
- `messages:seen` - Mark messages as read

**Incoming**:
- `shout` - New message
- `conversation:created` - New conversation
- `conversation:updated` - Conversation status changed
- `typing` - User typing
- `presence_state` - Online users
- `presence_diff` - Presence changes

### Example Usage

```javascript
// Send message
channel.push("shout", {
  body: "Hello!",
  customer_id: customerId,
  sent_at: new Date().toISOString()
})

// Receive messages
channel.on("shout", (payload) => {
  console.log("New message:", payload)
})

// Typing indicator
channel.push("typing", { typing: true })
setTimeout(() => {
  channel.push("typing", { typing: false })
}, 2000)
```

## Integrations

### Slack Integration

**OAuth Flow**:
```mermaid
sequenceDiagram
    participant Agent
    participant Netia
    participant Slack
    
    Agent->>Netia: Initiate OAuth
    Netia->>Slack: Redirect to Slack
    Slack->>Agent: Authorize app
    Slack->>Netia: Callback with code
    Netia->>Slack: Exchange code for token
    Slack-->>Netia: Access token
    Netia->>Netia: Save authorization
    Netia-->>Agent: Connected!
```

**Endpoints**:
- `GET /api/slack/oauth` - Initiate OAuth
- `GET /api/slack/authorization` - Get current authorization
- `POST /api/slack/notify` - Send notification to Slack
- `DELETE /api/slack/authorizations/:id` - Disconnect

**Webhook Events**:
- `POST /api/slack/webhook` - Receive Slack events
- `POST /api/slack/actions` - Handle Slack button actions

**Features**:
- Two-way sync: Netia ↔ Slack
- Channel mapping: Link Netia inbox to Slack channel
- Thread support: Replies maintain thread context
- Rich formatting: Markdown, mentions, attachments

### Gmail Integration

**OAuth Flow**:
```mermaid
sequenceDiagram
    participant Agent
    participant Netia
    participant Google
    
    Agent->>Netia: Connect Gmail
    Netia->>Google: OAuth request
    Google->>Agent: Authorize access
    Google->>Netia: Callback with token
    Netia->>Google: Verify token
    Netia->>Netia: Save authorization
    Netia-->>Agent: Connected!
```

**Endpoints**:
- `GET /api/google/auth` - Initiate OAuth
- `GET /api/google/oauth` - OAuth callback
- `GET /api/google/authorization` - Get authorization
- `POST /api/gmail/send` - Send email
- `DELETE /api/google/authorizations/:id` - Disconnect

**Email Forwarding**:
- Forward emails to: `support@{domain}`
- AWS SES receives emails
- Webhook: `POST /api/ses/webhook`
- Creates conversation automatically

**Sync Process**:
- Worker: `SyncGmailInboxes` (runs every minute)
- Worker: `SyncGmailInbox` (per authorization)
- Pulls new emails from Gmail API
- Creates conversations/messages

### Twilio (SMS) Integration

**Setup**:
1. Configure Twilio account
2. Get phone number
3. Set webhook URL: `POST /api/twilio/webhook`

**Endpoints**:
- `POST /api/twilio/auth` - Link Twilio account
- `GET /api/twilio/authorization` - Get authorization
- `POST /api/twilio/send` - Send SMS
- `DELETE /api/twilio/authorizations/:id` - Disconnect

**Flow**:
1. Customer texts Twilio number
2. Twilio webhook → Netia creates conversation
3. Agent replies in dashboard
4. Netia sends SMS via Twilio API

### GitHub Integration

**Features**:
- Link GitHub issues to conversations
- Create issues from conversations
- View issue details

**Endpoints**:
- `GET /api/github/oauth` - OAuth flow
- `GET /api/github/repos` - List repositories
- `GET /api/github/issues` - List issues
- `POST /api/github/issues` - Create issue

### Other Integrations

**HubSpot**:
- Sync contacts
- Create/update contacts
- Link to conversations

**Intercom**:
- Sync contacts
- Two-way conversation sync

**Mattermost**:
- Similar to Slack
- Team chat integration

## Webhooks

### Event Subscriptions

**Create Subscription**:
```http
POST /api/event_subscriptions
{
  "event_subscription": {
    "url": "https://your-app.com/webhook",
    "event_types": ["message:created", "conversation:created"]
  }
}
```

**Verification**:
- Subscriptions require verification
- Callback: `POST /api/event_subscriptions/verify`
- Sends challenge, expects response

**Events**:
- `message:created` - New message
- `conversation:created` - New conversation
- `conversation:updated` - Status change
- `customer:created` - New customer

### Webhook Payloads

**Message Created**:
```json
{
  "event": "message:created",
  "payload": {
    "id": "...",
    "body": "Hello!",
    "conversation_id": "...",
    "customer_id": "...",
    "user_id": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## API Rate Limiting

Currently no explicit rate limiting, but:
- Authentication required for most endpoints
- Account-based isolation
- Webhook endpoints secured by signatures (Slack, Stripe, etc.)

## Error Handling

### Standard Error Format

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common Errors

- `401 Unauthorized` - Invalid/missing token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Validation Errors

```json
{
  "errors": {
    "email": ["can't be blank"],
    "password": ["is too short"]
  }
}
```

## API Versioning

Currently using `/api` prefix. Future versioning:
- `/api/v1/...` - Versioned endpoints
- `/api/...` - Latest version

## Testing API

### Swagger UI

Available at: `/api/swagger` (development only)

### Example Requests

**cURL**:
```bash
# Login
curl -X POST http://localhost:4000/api/session \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "user@example.com", "password": "pass"}}'

# Get conversations
curl -X GET http://localhost:4000/api/conversations \
  -H "Authorization: Bearer {token}"
```

**JavaScript**:
```javascript
// Using fetch
const response = await fetch('/api/conversations', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
```

