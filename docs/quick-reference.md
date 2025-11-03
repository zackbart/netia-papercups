# Quick Reference

## API Cheat Sheet

### Authentication

```http
POST /api/session
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "password": "password"
  }
}
```

**Response**: `{ "user": {...}, "token": "..." }`

```http
Authorization: Bearer {token}
```

### Core Endpoints

#### Conversations

```http
GET    /api/conversations              # List conversations
GET    /api/conversations/:id          # Get conversation
PUT    /api/conversations/:id          # Update conversation
POST   /api/conversations/:id/archive  # Archive conversation
POST   /api/conversations/:id/share    # Share conversation
GET    /api/conversations/unread       # Unread conversations
GET    /api/conversations/count         # Conversation count
```

#### Messages

```http
GET    /api/messages                   # List messages
POST   /api/messages                   # Create message
GET    /api/messages/:id               # Get message
PUT    /api/messages/:id               # Update message
DELETE /api/messages/:id               # Delete message
GET    /api/messages/count             # Message count
```

#### Customers

```http
GET    /api/customers                  # List customers
GET    /api/customers/:id              # Get customer
POST   /api/customers                  # Create customer (public)
PUT    /api/customers/:id              # Update customer
POST   /api/customers/identify         # Identify customer (public)
GET    /api/customers/:id/exists       # Check if exists (public)
```

#### Users

```http
GET    /api/users                      # List users
GET    /api/users/:id                  # Get user
DELETE /api/users/:id                  # Delete user
POST   /api/users/:id/disable          # Disable user
POST   /api/users/:id/enable           # Enable user
PUT    /api/users/:id/role             # Update role
```

### WebSocket Channels

**Connect**:
```javascript
const socket = new Socket("/socket", { params: {} })
socket.connect()
```

**Join Channel**:
```javascript
// Conversation channel
const channel = socket.channel(`conversation:${conversationId}`, {
  customer_id: customerId
})
channel.join()

// Notification channel (agents)
const channel = socket.channel(`notification:${accountId}`, {})
channel.join()
```

**Send Message**:
```javascript
channel.push("shout", {
  body: "Hello!",
  customer_id: customerId,
  sent_at: new Date().toISOString()
})
```

**Listen to Events**:
```javascript
channel.on("shout", (payload) => {
  console.log("New message:", payload)
})

channel.on("conversation:updated", ({id, updates}) => {
  console.log("Conversation updated:", id, updates)
})

channel.on("typing", (payload) => {
  console.log("Typing:", payload.typing)
})
```

### Common Integrations

#### Slack

```http
GET  /api/slack/oauth           # Initiate OAuth
GET  /api/slack/authorization   # Get authorization
POST /api/slack/notify          # Send notification
POST /api/slack/webhook         # Webhook (public)
DELETE /api/slack/authorizations/:id  # Disconnect
```

#### Gmail

```http
GET  /api/google/auth           # Initiate OAuth
GET  /api/google/oauth          # OAuth callback
GET  /api/google/authorization  # Get authorization
POST /api/gmail/send            # Send email
DELETE /api/google/authorizations/:id  # Disconnect
```

#### Twilio

```http
POST /api/twilio/auth           # Link account
GET  /api/twilio/authorization  # Get authorization
POST /api/twilio/send           # Send SMS
POST /api/twilio/webhook        # Webhook (public)
DELETE /api/twilio/authorizations/:id  # Disconnect
```

## Environment Variables

### Required

```
DATABASE_URL=ecto://user:pass@host:port/db?ssl=true
SECRET_KEY_BASE=your_secret_key_base_64_bytes_minimum
MIX_ENV=prod
REQUIRE_DB_SSL=true
```

### Optional

```
# LLM
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=500
LLM_TEMPERATURE=0.7
LLM_TIMEOUT=30000
LLM_MAX_RETRIES=2

# URLs
BACKEND_URL=http://localhost:4000
REACT_APP_URL=http://localhost:4000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_TLS_URL=rediss://...

# Node
NODE_OPTIONS=--openssl-legacy-provider
```

## Development Commands

```bash
# Setup
./dev.sh setup                  # Install deps, setup DB

# Development
./dev.sh start                 # Start dev servers
./dev.sh stop                  # Stop dev servers

# Database
./dev.sh migrate               # Run migrations
./dev.sh reset                 # Reset database

# Testing
./dev.sh test                  # Run tests
./dev.sh format                # Format code

# Production
./dev.sh build                 # Build for production
```

## Common Mix Tasks

```bash
mix ecto.setup                 # Create DB, migrate, seed
mix ecto.migrate               # Run migrations
mix ecto.rollback              # Rollback last migration
mix ecto.reset                 # Drop, create, migrate, seed
mix deps.get                   # Get dependencies
mix compile                    # Compile code
mix phx.server                 # Start Phoenix server
```

## Chat Widget

### Embed Code

```html
<!-- Chat Widget Embed -->
<div id="netia-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <button id="netia-chat-button" style="...">💬</button>
</div>

<script>
(function() {
  const button = document.getElementById('netia-chat-button');
  let iframe = null;
  
  button.addEventListener('click', function() {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.src = 'https://app.netia.io/chat?token=ACCOUNT_ID&inbox=INBOX_ID';
      iframe.style.cssText = '...';
      document.body.appendChild(iframe);
    }
  });
})();
</script>
```

### Widget URL Parameters

```
/chat?token=ACCOUNT_ID          # Required: Account ID
&inbox=INBOX_ID                 # Optional: Inbox ID
&title=Chat                     # Title
&subtitle=Support               # Subtitle
&primaryColor=#1677ff           # Primary color
&greeting=Hello!                # Greeting message
&showAgentAvailability=1        # Show availability
&isBrandingHidden=true          # Hide branding
```

## Background Jobs

### Queues

- `default` - General jobs (10 workers)
- `events` - Real-time events (50 workers)
- `mailers` - Email sending (20 workers)

### Common Workers

```elixir
# Send email notification
Oban.insert(%{
  worker: "ChatApi.Workers.SendConversationReplyEmail",
  args: %{message: message}
})

# Sync Gmail inbox
Oban.insert(%{
  worker: "ChatApi.Workers.SyncGmailInbox",
  args: %{account_id: account_id, authorization_id: auth_id}
})

# Process SES event
Oban.insert(%{
  worker: "ChatApi.Workers.ProcessSesEvent",
  args: %{ses_message_id: id, ...}
})
```

## Database Queries

### Common Ecto Queries

```elixir
# Get conversation with messages
Conversations.get_conversation!(conversation_id)
|> Repo.preload(:messages)

# List messages by conversation
Messages.list_by_conversation(conversation_id, %{})

# Find customer by email
Customers.find_by_email(email, account_id)

# Get unread conversations
Conversations.list_unread(account_id)
```

## File Structure

```
lib/
  chat_api/              # Core business logic
    conversations.ex     # Conversation context
    messages.ex          # Message context
    customers.ex         # Customer context
    users.ex            # User context
    llm/                # LLM integration
  chat_api_web/         # Web layer
    controllers/        # HTTP handlers
    channels/          # WebSocket handlers
    views/             # JSON serialization
    templates/         # HTML templates
  workers/              # Background jobs
```

## Ports

- **4000** - Phoenix server (backend)
- **3000** - CRA dev server (frontend, dev only)
- **5432** - PostgreSQL (local only, Railway in prod)

## Debugging

### IEx Console

```bash
iex -S mix phx.server
```

```elixir
# Check conversation
conversation = ChatApi.Repo.get!(ChatApi.Conversations.Conversation, id)

# Check messages
messages = ChatApi.Messages.list_by_conversation(conversation_id)

# Check user
user = ChatApi.Users.get_user!(user_id)

# Test LLM
ChatApi.LLM.ResponseHandler.handle_customer_message(conversation_id, account_id)
```

### Logs

```bash
# View logs
tail -f log/dev.log

# Filter for errors
tail -f log/dev.log | grep ERROR

# Filter for specific conversation
tail -f log/dev.log | grep "conversation:ID"
```

## Common Patterns

### Creating Message

```elixir
Messages.create_message(%{
  body: "Hello!",
  conversation_id: conversation_id,
  account_id: account_id,
  customer_id: customer_id,
  source: "chat"
})
```

### Broadcasting Update

```elixir
ChatApiWeb.Endpoint.broadcast!(
  "conversation:#{conversation_id}",
  "shout",
  Messages.Helpers.format(message)
)
```

### Triggering LLM

```elixir
Task.start(fn ->
  ChatApi.LLM.ResponseHandler.handle_customer_message(conversation_id, account_id)
end)
```

### Queueing Background Job

```elixir
%{message: message}
|> ChatApi.Workers.SendConversationReplyEmail.new()
|> Oban.insert()
```

