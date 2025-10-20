# Netia Papercups Deployment Guide

## 🌐 Netia Domain Configuration

### **Domain Structure:**
- **Papercups**: `https://papercups.netia.ai` (Railway deployed)
- **API**: `https://api.netia.ai` (Your main API)
- **Admin/Customer Portal**: `https://app.netia.ai` (Web dashboard)

## 🚂 Railway Deployment Steps

### 1. Deploy to Railway
```bash
cd /Users/zackbart/Dev/netia-papercups
railway login
railway init
railway add postgresql
railway up
```

### 2. Configure Custom Domain
1. In Railway dashboard, go to "Settings" → "Domains"
2. Add custom domain: `papercups.netia.ai`
3. Update DNS records as instructed by Railway

### 3. Environment Variables
Copy all variables from `railway-variables.txt` into Railway dashboard:

**Key Variables:**
```bash
BACKEND_URL=papercups.netia.ai
REACT_APP_URL=papercups.netia.ai
NETIA_API_URL=https://api.netia.ai
NETIA_WEBHOOK_URL=https://api.netia.ai/papercups/webhook
NETIA_WEBHOOK_SECRET=+SpvwnaBl2oiZrC0hOnPV16HmUcFYo/XFrXO6OA4IeA=
```

## 🔗 Integration Configuration

### 1. Update Your Main API
Your main API's `.env` file should include:
```bash
PAPERCUPS_URL=https://papercups.netia.ai
PAPERCUPS_WEBHOOK_SECRET=+SpvwnaBl2oiZrC0hOnPV16HmUcFYo/XFrXO6OA4IeA=
CORS_ORIGIN=https://papercups.netia.ai,https://api.netia.ai,https://app.netia.ai
```

### 2. Widget Code Generation
Your API will generate widget codes like this:
```html
<script>
  window.Papercups = {
    config: {
      token: 'tenant-account-id',
      baseUrl: 'https://papercups.netia.ai',
      title: 'Welcome to Customer Business!',
      // ... other config
    }
  };
</script>
<script src="https://papercups.netia.ai/widget.js"></script>
```

## 🔄 Data Flow

```
Customer Website → Papercups Widget → papercups.netia.ai → api.netia.ai/webhook
                                                                    ↓
api.netia.ai → Processes Message → Generates Response → Sends back to papercups.netia.ai
```

## 🧪 Testing

### 1. Test Papercups Deployment
```bash
# Health check
curl https://papercups.netia.ai/health

# Widget endpoint
curl https://papercups.netia.ai/widget.js
```

### 2. Test API Integration
```bash
# Test webhook endpoint
curl -X POST https://api.netia.ai/papercups/webhook \
  -H "Content-Type: application/json" \
  -H "X-Papercups-Signature: sha256=..." \
  -d '{"type": "message:created", "data": {...}}'
```

### 3. Test Widget Code Generation
```bash
# Get widget code for a tenant
curl -H "X-API-Key: tenant-api-key" \
  https://api.netia.ai/api/v1/tenant/widget-code
```

## 🔧 Post-Deployment Configuration

### 1. Papercups Admin Setup
1. Go to `https://papercups.netia.ai`
2. Create admin account
3. Configure webhooks in Settings → Webhooks:
   - URL: `https://api.netia.ai/papercups/webhook`
   - Secret: `+SpvwnaBl2oiZrC0hOnPV16HmUcFYo/XFrXO6OA4IeA=`

### 2. Multi-Tenant Account Creation
Each customer will get:
- Unique Papercups account ID
- Custom widget code
- Isolated conversation history
- Tenant-specific AI responses

### 3. DNS Configuration
Ensure these DNS records are set up:
```
papercups.netia.ai → Railway IP
api.netia.ai → Your API server IP
app.netia.ai → Your web dashboard IP
```

## 🚀 Go Live Checklist

- [ ] Railway deployment successful
- [ ] Custom domain `papercups.netia.ai` configured
- [ ] Environment variables set in Railway
- [ ] Main API updated with Papercups URL
- [ ] Webhook configuration in Papercups admin
- [ ] DNS records updated
- [ ] SSL certificates active
- [ ] Test widget code generation
- [ ] Test webhook integration
- [ ] Test end-to-end chat flow

## 🔍 Troubleshooting

### Common Issues:

1. **Domain not resolving**
   - Check DNS records
   - Verify SSL certificates

2. **Webhook not working**
   - Check webhook URL accessibility
   - Verify webhook secret matches

3. **Widget not loading**
   - Check CORS configuration
   - Verify widget.js is accessible

4. **Database connection issues**
   - Check Railway PostgreSQL service
   - Verify DATABASE_URL is set

### Support:
- Railway logs: Railway dashboard → Deployments → View logs
- Papercups logs: Railway dashboard → Service logs
- API logs: Your API server logs
