# Railway Deployment Guide for Netia Papercups

## 🚂 Quick Start

### 1. Connect Repository to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `netia-papercups` repository
4. Railway will automatically detect the Dockerfile

### 2. Add PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically create a `DATABASE_URL` environment variable
3. The database will be available at `${{Postgres.DATABASE_URL}}`

### 3. Configure Environment Variables

Add these environment variables in Railway dashboard:

#### Required Variables:
```bash
# Security (Generate these!)
SECRET_KEY_BASE=your-super-secret-key-base-here-must-be-at-least-64-bytes-long
SECRET_KEY_BASE_DEV=your-dev-secret-key-base-here

# Application URLs (Update with your Railway domain)
BACKEND_URL=papercups-production.up.railway.app
REACT_APP_URL=papercups-production.up.railway.app
REACT_APP_FILE_UPLOADS_ENABLED=1

# Database Configuration
POOL_SIZE=10
REQUIRE_DB_SSL=true
MIX_ENV=prod

# Multi-Tenant Integration
NETIA_API_URL=https://api.yourdomain.com
NETIA_WEBHOOK_URL=https://api.yourdomain.com/papercups/webhook
NETIA_WEBHOOK_SECRET=your-webhook-secret-here
MULTI_TENANT_MODE=true
DEFAULT_ACCOUNT_NAME=Netia Multi-Tenant
AUTO_CREATE_ACCOUNTS=true
```

#### Optional Variables:
```bash
# Email Configuration
SMTP_ADAPTER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
BUCKET_NAME=your-papercups-bucket
AWS_REGION=us-east-1

# External Integrations
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 4. Deploy

1. Railway will automatically build and deploy your application
2. The deployment process will:
   - Build the Docker image
   - Run database migrations
   - Start the application
3. Your Papercups instance will be available at your Railway domain

### 5. Custom Domain (Optional)

1. In Railway dashboard, go to "Settings" → "Domains"
2. Add your custom domain (e.g., `papercups.yourdomain.com`)
3. Update your environment variables with the new domain

## 🔧 Configuration Details

### Database Setup
- Railway automatically provides PostgreSQL
- Database migrations run automatically on deployment
- Connection pooling is configured for production

### Multi-Tenant Integration
- Each tenant gets their own Papercups account
- Webhooks are sent to your API for message processing
- Account creation is automated for new tenants

### Security
- SSL/TLS is enabled by default
- Database connections use SSL
- Secret keys are required for security

## 🚀 Post-Deployment

### 1. Test the Deployment
```bash
# Check health endpoint
curl https://your-railway-domain.up.railway.app/health

# Test widget endpoint
curl https://your-railway-domain.up.railway.app/widget.js
```

### 2. Update Your API Configuration
Update your main API's `.env` file:
```bash
PAPERCUPS_URL=https://your-railway-domain.up.railway.app
PAPERCUPS_API_KEY=your-papercups-api-key
PAPERCUPS_WEBHOOK_SECRET=your-webhook-secret
```

### 3. Configure Webhooks
1. In Papercups admin panel, go to Settings → Webhooks
2. Add webhook URL: `https://api.yourdomain.com/papercups/webhook`
3. Set webhook secret to match your API configuration

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Errors**
   - Check `DATABASE_URL` is set correctly
   - Ensure `REQUIRE_DB_SSL=true` for Railway

2. **Build Failures**
   - Check Dockerfile syntax
   - Ensure all dependencies are properly specified

3. **Webhook Issues**
   - Verify webhook URL is accessible
   - Check webhook secret matches between systems

4. **Widget Not Loading**
   - Check `REACT_APP_URL` matches your domain
   - Verify CORS settings

### Logs and Monitoring:
- View logs in Railway dashboard
- Set up Sentry for error tracking
- Monitor database performance

## 📊 Scaling

Railway automatically handles:
- Horizontal scaling based on traffic
- Database connection pooling
- Load balancing
- Health checks and restarts

For high-traffic scenarios, consider:
- Upgrading Railway plan
- Adding Redis for caching
- Optimizing database queries
- Using CDN for static assets
