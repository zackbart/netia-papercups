# 🚂 Railway Deployment Steps for Netia Papercups

## Quick Deployment

### Step 1: Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `netia-papercups` repository

### Step 2: Add PostgreSQL Database
1. In your new project, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set `DATABASE_URL`

### Step 3: Configure Environment Variables
1. Go to your project → "Variables" tab
2. Copy ALL variables from the `.env` file in this repository
3. Paste them into Railway dashboard

### Step 4: Configure Custom Domain
1. Go to "Settings" → "Domains"
2. Add custom domain: `papercups.netia.ai`
3. Update your DNS records as instructed

### Step 5: Deploy
Railway will automatically build and deploy your application.

## 🔍 Post-Deployment Checklist

- [ ] Project created successfully
- [ ] PostgreSQL database added
- [ ] Environment variables copied from `.env`
- [ ] Custom domain added (papercups.netia.ai)
- [ ] DNS records updated
- [ ] Deployment successful
- [ ] Health check passes: `curl https://papercups.netia.ai/health`

## 🚨 Troubleshooting

### Build Issues:
- Check Dockerfile syntax
- Verify all dependencies are specified
- Check build logs in Railway dashboard

### Database Issues:
- Verify `DATABASE_URL` is set
- Check PostgreSQL service is running
- Ensure `REQUIRE_DB_SSL=true`

### Domain Issues:
- Verify DNS records are updated
- Check SSL certificate status
- Test domain resolution

### Webhook Issues:
- Verify `NETIA_WEBHOOK_URL` is correct
- Check webhook secret matches
- Test webhook endpoint accessibility

## 📞 Support

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Project Logs: Railway Dashboard → Deployments → View Logs
