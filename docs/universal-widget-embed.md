# Universal Widget Embed System

## Overview

The Universal Widget Embed System allows Netia customers to easily embed the AI chat widget on any website platform with full customization support. The system uses a lightweight iframe-based approach with query parameters, making it compatible with WordPress, Wix, Squarespace, Shopify, and any other platform that supports HTML/JavaScript.

## Architecture

### Components

1. **Backend Chat Endpoint** (`/chat`)
   - Lightweight HTML page served via Phoenix
   - Self-contained with Phoenix.js from CDN
   - Mobile-responsive with touch-friendly UI
   - Real-time WebSocket integration for AI responses

2. **Frontend Components**
   - `UniversalEmbedCode.tsx` - Generates embed code snippets
   - `PlatformInstructions.tsx` - Platform-specific installation guides
   - `ChatWidgetSettings.tsx` - Updated with embed code section

3. **Database**
   - `widget_settings` table includes `is_branding_hidden` field
   - Per-inbox customization support

## How It Works

### Embed Code Generation

The system generates two types of embed codes:

#### 1. Script with Chat Button (Recommended)
```html
<script>
  (function() {
    var config = {
      token: "account_id",
      inbox: "inbox_id",
      title: "Welcome!",
      primaryColor: "#1890ff",
      // ... other customization options
    };
    
    // Creates floating button that opens iframe on click
    var btn = document.createElement('button');
    // ... button creation and click handler
  })();
</script>
```

**Advantages:**
- Non-intrusive - chat only loads when clicked
- Better UX - floating button always accessible
- Faster initial page load
- Toggle open/close functionality

#### 2. Always-Visible Iframe
```html
<iframe 
  src="https://app.netia.ai/chat?token=...&inbox=...&title=..."
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; ..."
  title="Chat with us">
</iframe>
```

**Advantages:**
- Simpler implementation
- Chat always visible
- No JavaScript execution required

### Customization Options

All customization is passed via URL query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `token` | string | Account ID (required) | `d790d8f5-92b9-4db8-bea2` |
| `inbox` | string | Inbox ID | `d790d8f5-92b9-4db8-bea2` |
| `title` | string | Widget title | `Welcome to Netia` |
| `subtitle` | string | Widget subtitle | `Ask us anything!` |
| `primaryColor` | string | Brand color (hex) | `#1890ff` |
| `greeting` | string | Initial greeting message | `Hello! How can we help?` |
| `awayMessage` | string | Away status message | `We're offline` |
| `newMessagePlaceholder` | string | Input placeholder | `Type your message...` |
| `showAgentAvailability` | boolean | Show online status | `1` or `0` |
| `agentAvailableText` | string | Online status text | `We're online!` |
| `agentUnavailableText` | string | Offline status text | `We're away` |
| `requireEmailUpfront` | boolean | Require email first | `1` or `0` |
| `iconVariant` | string | Icon style | `outlined` or `filled` |
| `isBrandingHidden` | boolean | Hide "Powered by" | `true` or `false` |

### Mobile Responsiveness

The widget includes mobile-specific CSS:
- 16px font size on inputs (prevents iOS zoom)
- Touch-friendly button sizes (44px minimum)
- Responsive sizing with `max-width` and `max-height`
- Smooth scrolling to new messages

### Real-Time Communication

1. **Customer sends message** → REST API call to `/api/customers` and `/api/conversations`
2. **WebSocket connection** → Joins conversation channel via Phoenix.js
3. **AI processes message** → LLM generates response in background task
4. **Response broadcast** → WebSocket pushes AI message to customer
5. **Smooth scroll** → Chat auto-scrolls to show new message

## Platform Compatibility

### Verified Platforms

- ✅ **WordPress** - Custom HTML widget or theme footer
- ✅ **Wix** - Embed HTML element
- ✅ **Squarespace** - Code Injection or Code Block
- ✅ **Shopify** - theme.liquid file
- ✅ **Webflow** - Custom Code in project settings
- ✅ **GoDaddy** - HTML section
- ✅ **Plain HTML** - Before closing `</body>` tag
- ✅ **React/Next.js** - useEffect hook or _document.js

### Installation Instructions

Platform-specific instructions are provided in the `PlatformInstructions.tsx` component, which displays collapsible guides for each platform.

## Configuration in Admin Dashboard

Customers configure their widget in the **Chat Widget Settings** page:

1. **Customize Section**
   - Title, subtitle, colors
   - Greeting and away messages
   - Agent availability display
   - Email requirements
   - Icon variant
   - **NEW:** Hide branding toggle

2. **Universal Embed Code Section**
   - Tab 1: Script with chat button (recommended)
   - Tab 2: Always-visible iframe
   - Copy button for quick copying

3. **Platform Instructions Section**
   - Collapsible accordion with platform-specific guides
   - WordPress, Wix, Squarespace, Shopify, etc.

4. **Legacy Installation Section**
   - Original React component method
   - NPM package installation

## Database Schema

### Migration: `20251023125249_add_branding_to_widget_settings.exs`

```elixir
alter table(:widget_settings) do
  add :is_branding_hidden, :boolean, default: false
end
```

### Schema: `widget_setting.ex`

The `is_branding_hidden` field is included in:
- Type spec (line 19)
- Schema field (line 51)
- Changeset cast (line 84)

## Backend Implementation

### Router: `lib/chat_api_web/router.ex`

```elixir
pipeline :widget do
  plug(:accepts, ["html"])
  plug(:fetch_session)
  plug(:fetch_flash)
  # No X-Frame-Options header for widget iframe
end

scope "/", ChatApiWeb do
  pipe_through(:widget)
  get("/chat", WidgetController, :chat)
end
```

### Controller: `lib/chat_api_web/controllers/widget_controller.ex`

The `chat/2` function returns inline HTML with:
- Phoenix.js from CDN
- Mobile-responsive CSS
- Query parameter extraction
- WebSocket connection logic
- Customer/conversation creation via REST
- Real-time message handling

## Testing

### Local Testing

1. Start backend: `./dev.sh backend`
2. Open `test_universal_embed.html` in browser
3. Click chat button
4. Send message
5. Verify AI response appears
6. Test mobile by resizing window

### Production Testing

1. Get account ID and inbox ID from dashboard
2. Copy embed code from Chat Widget Settings
3. Replace placeholder IDs in embed code
4. Paste into test website
5. Verify functionality across devices

## Key Benefits

1. **Universal Compatibility** - Works on any platform that allows HTML/JS
2. **Simple Installation** - Copy-paste code snippet
3. **Inline Customization** - All settings in embed code
4. **Mobile-First** - Responsive and touch-friendly
5. **Real-Time AI** - WebSocket-powered AI responses
6. **Per-Inbox Settings** - Different widgets for different inboxes
7. **No Build Required** - Pure runtime configuration

## Future Enhancements

Potential improvements for future iterations:

1. **Widget SDK** - JavaScript API for programmatic control
2. **Advanced Styling** - Custom CSS injection
3. **Multi-Language Support** - Internationalization
4. **File Upload** - Attachment support in widget
5. **Typing Indicators** - Show when AI is typing
6. **Read Receipts** - Message delivery status
7. **Rich Responses** - Markdown, buttons, cards
8. **Analytics** - Conversation metrics in dashboard

## Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Verify account/inbox IDs are correct
3. Ensure backend is running
4. Check if site blocks iframes

### AI Not Responding

1. Check OpenAI API key is set
2. Verify business context is configured
3. Check backend logs for errors
4. Test WebSocket connection

### Mobile Issues

1. Clear browser cache
2. Check viewport meta tag
3. Test on actual device (not just resize)
4. Verify touch event handlers

## Support

For issues or questions:
- Check backend logs: `./dev.sh logs backend`
- Review browser console errors
- Test with `test_universal_embed.html`
- Contact development team

---

**Last Updated:** October 23, 2025  
**Version:** 1.0.0

