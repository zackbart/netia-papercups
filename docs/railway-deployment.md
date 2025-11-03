# Railway Deployment Guide

## Overview

Netia is configured for deployment on [Railway](https://railway.app), which provides managed PostgreSQL and automatic deployments from GitHub.

## Architecture

```mermaid
graph TB
    subgraph "Railway Platform"
        RailwayApp[Railway App<br/>Docker Container]
        RailwayDB[PostgreSQL<br/>Managed]
        RailwayRedis[Redis<br/>Optional]
    end
    
    subgraph "GitHub"
        Repo[GitHub Repository<br/>Main Branch]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API<br/>LLM]
        Slack[Slack API]
        Gmail[Gmail API]
    end
    
    Repo -->|Push| RailwayApp
    RailwayApp --> RailwayDB
    RailwayApp --> RailwayRedis
    RailwayApp --> OpenAI
    RailwayApp --> Slack
    RailwayApp --> Gmail
```

## Setup

### 1. Connect GitHub Repository

1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway automatically detects the `Dockerfile`

### 2. Add PostgreSQL Database

1. In Railway project, click **"New"** → **"Database"**
2. Select **"PostgreSQL"**
3. Railway creates database and sets `DATABASE_URL` automatically

### 3. Configure Environment Variables

Add required environment variables in Railway:

**Required**:
```
MIX_ENV=prod
REQUIRE_DB_SSL=true
SECRET_KEY_BASE=your_secret_key_base_64_bytes_minimum
```

**Optional**:
```
# LLM
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=500
LLM_TEMPERATURE=0.7

# URLs
BACKEND_URL=https://your-app.railway.app
REACT_APP_URL=https://your-app.railway.app

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...

# Redis (optional, for multi-node)
REDIS_URL=redis://...
REDIS_TLS_URL=rediss://...

# Other integrations
PAPERCUPS_STRIPE_SECRET=sk_...
REACT_APP_STRIPE_PUBLIC_KEY=pk_...
```

### 4. Railway Auto-Detection

Railway automatically:
- Detects `Dockerfile` for build
- Sets `DATABASE_URL` from PostgreSQL service
- Runs migrations via `docker-entrypoint.sh`
- Exposes service on port (or custom domain)

## Deployment Flow

```mermaid
sequenceDiagram
    participant Dev
    participant GitHub
    participant Railway
    participant Docker
    participant DB
    
    Dev->>GitHub: Push to main
    GitHub->>Railway: Webhook trigger
    Railway->>Docker: Build from Dockerfile
    Docker->>Docker: Build frontend
    Docker->>Docker: Compile Elixir
    Docker->>Docker: Create release
    Railway->>Railway: Start container
    Railway->>DB: Run migrations
    Railway->>Railway: Start Phoenix
    Railway-->>Dev: Deployed!
```

### Build Process

1. **Docker Build**:
   ```dockerfile
   # Build frontend (React)
   RUN npm run build --prefix=assets
   
   # Compile Elixir
   RUN mix deps.compile
   RUN mix phx.digest priv/static
   
   # Create release
   RUN mix release papercups
   ```

2. **Container Start**:
   ```bash
   # Entrypoint runs:
   /entrypoint.sh db migrate  # Run migrations
   /entrypoint.sh run          # Start Phoenix
   ```

## Configuration

### Dockerfile

The `Dockerfile` is multi-stage:

**Stage 1 - Builder**:
- Installs Node.js, npm
- Builds React frontend (`npm run build`)
- Installs Elixir dependencies
- Compiles Elixir/Phoenix
- Creates OTP release

**Stage 2 - Runtime**:
- Alpine Linux base
- Copies release and assets
- Sets up non-root user
- Exposes port 4000

### docker-entrypoint.sh

Entrypoint script handles:

```bash
# Run migrations
/entrypoint.sh db migrate

# Start Phoenix server
/entrypoint.sh run
```

## Environment Variables

### Database

Railway automatically provides:
```
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

**Note**: Railway uses `postgresql://` but Ecto expects `ecto://`. The runtime config handles this conversion.

### Secrets

Generate `SECRET_KEY_BASE`:
```bash
mix phx.gen.secret
```

Or use Railway's secret generation in dashboard.

### URLs

Set based on your Railway domain:
```
BACKEND_URL=https://your-app.railway.app
REACT_APP_URL=https://your-app.railway.app
```

## Custom Domain

1. In Railway service settings
2. Go to **"Settings"** → **"Domains"**
3. Add custom domain
4. Configure DNS (CNAME record)
5. Railway handles SSL automatically

## Scaling

### Horizontal Scaling

Railway supports multiple instances:
- Each instance connects to same PostgreSQL
- Use Redis PubSub for multi-node messaging
- Set `REDIS_URL` for distributed PubSub

### Vertical Scaling

Railway auto-scales based on:
- CPU usage
- Memory usage
- Request volume

## Monitoring

### Railway Logs

View logs in Railway dashboard:
- Real-time logs
- Build logs
- Deployment logs

### Application Logs

Phoenix logs appear in Railway:
```bash
# Filter for errors
railway logs | grep ERROR

# Filter for specific conversation
railway logs | grep "conversation:ID"
```

## Database Migrations

### Automatic Migrations

Migrations run automatically on deployment via:
```bash
/entrypoint.sh db migrate
```

### Manual Migrations

If needed, run manually:
```bash
# Via Railway CLI
railway run mix ecto.migrate

# Or via Railway shell
railway shell
mix ecto.migrate
```

### Migration Rollback

```bash
railway run mix ecto.rollback
```

## Troubleshooting

### Build Failures

**Check**:
1. Dockerfile syntax
2. Node.js/Elixir versions
3. Dependencies in `mix.exs` and `package.json`

**Debug**:
```bash
# Build locally
docker build -t netia .

# Test locally
docker run -p 4000:4000 -e DATABASE_URL=... netia
```

### Database Connection Issues

**Check**:
1. `DATABASE_URL` is set correctly
2. `REQUIRE_DB_SSL=true` matches Railway settings
3. Database service is running

**Test Connection**:
```bash
railway run mix ecto.migrate
```

### Application Crashes

**Check Logs**:
```bash
railway logs --tail
```

**Common Issues**:
- Missing environment variables
- Database migration failures
- Port conflicts (Railway auto-assigns ports)

### Migration Failures

**Check**:
1. Database is accessible
2. Migrations are compatible with current schema
3. No conflicting migrations

**Fix**:
```bash
# Rollback and re-run
railway run mix ecto.rollback
railway run mix ecto.migrate
```

## Production Checklist

- [ ] `DATABASE_URL` set (automatic from Railway)
- [ ] `SECRET_KEY_BASE` set (generate unique secret)
- [ ] `MIX_ENV=prod`
- [ ] `REQUIRE_DB_SSL=true`
- [ ] All required API keys set (OpenAI, Stripe, etc.)
- [ ] Custom domain configured (optional)
- [ ] Redis configured (if multi-node)
- [ ] Environment variables from `.env.example` reviewed
- [ ] Migrations tested
- [ ] Build succeeds locally

## CI/CD Integration

Railway auto-deploys on:
- Push to main branch
- Pull request merges (optional)

**Branch Deployments**:
- Railway can deploy different branches
- Useful for staging environments

## Backup & Recovery

### Database Backups

Railway provides:
- Automatic daily backups
- Point-in-time recovery
- Manual backup exports

**Export Backup**:
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

**Restore Backup**:
```bash
railway run psql $DATABASE_URL < backup.sql
```

## Cost Optimization

### Tips

1. **Use Railway's free tier** for development
2. **Optimize Docker image** (multi-stage builds already implemented)
3. **Use connection pooling** (Ecto default: 10 connections)
4. **Enable Redis only if multi-node** (not required for single instance)

### Resource Limits

Railway provides:
- Free tier: 500 hours/month
- Hobby: $5/month
- Pro: $20/month (with more resources)

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: Community support
- **Railway Status**: https://status.railway.app

