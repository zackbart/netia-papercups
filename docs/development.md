# Development Guide

## Prerequisites

```bash
# Recommended: manage toolchains via asdf (uses .tool-versions)
brew install asdf   # macOS
# Or install Elixir/Erlang/Node via your preferred method
```

## Quick Start (Native Dev + Railway Postgres)

```bash
# 1) Copy env example and set Railway Postgres DATABASE_URL
cp .env.example .env
# Edit .env: set DATABASE_URL=ecto://postgres:password@host.proxy.rlwy.net:port/railway?ssl=true

# 2) One-time setup (installs deps, patches Pow for OTP 24+, sets up DB)
./dev.sh setup

# 3) Run the app (single command)
./dev.sh start
```

> **Note**: The setup process automatically patches the Pow library for OTP 24+ compatibility. If you run `mix deps.get` manually, you'll need to run `mix patch_pow` afterwards.

App will be running at:
- **Frontend**: http://localhost:3000 (CRA dev server)
- **API**: http://localhost:4000 (Phoenix - redirects to CRA in dev mode)

> **Note**: Visiting `http://localhost:4000` will automatically redirect to `http://localhost:3000` in development mode to ensure you're viewing live code, not compiled artifacts.

## Development Workflow

### Common Commands
```bash
# Start (hot reload with shared logs in current terminal)
./dev.sh start

# Stop all dev servers
./dev.sh stop

# Migrations
./dev.sh migrate

# Run tests
./dev.sh test

# Format code
./dev.sh format

# Build for production (Elixir + frontend)
./dev.sh build
```

### Development Server Features

**Simple dev start:**
- Phoenix starts with hot reload and spawns CRA via watcher
- CRA runs on port 3000 automatically
- Press **Ctrl+C** to stop

**Port Management:**
- Managed by Phoenix watcher; no manual steps needed

**Hot Reload:**
- Elixir/Phoenix: Automatic code reloading via `code_reloader`
- React/CRA: Hot Module Replacement (HMR) on port 3000

### Pow OTP 24+ Compatibility Patch

This project uses Pow 1.0.18, which requires a patch for Erlang/OTP 24+ compatibility. The patch is automatically applied when you run `mix setup` or `mix patch_pow`.

**Why?** Pow uses `:crypto.hmac/3`, which was deprecated in OTP 24+ in favor of `:crypto.mac/4`. The patch adds backward-compatible code that uses the newer API when available.

**Manual patching:**
```bash
mix patch_pow
```

This task checks if Pow is already patched and applies the patch if needed. It's safe to run multiple times.

### Manual Mix Commands (Alternative)
```bash
mix deps.get
npm i --prefix assets
mix ecto.setup
iex -S mix phx.server
```

## Database Operations
```bash
# Create the database (Neon URL must exist and be accessible)
mix ecto.create

# Run all migrations
mix ecto.migrate

# Create database, run migrations, and seed data (all in one)
mix ecto.setup

# Drop the database
mix ecto.drop

# Reset database (drop, create, migrate, seed)
mix ecto.reset

# Rollback the last migration
mix ecto.rollback

# Ecto SQL shell
mix ecto.console
```

## Environment Variables

Copy `.env.example` to `.env` and set values for local dev and production:
```bash
# Local Development (Railway Postgres)
DATABASE_URL=ecto://postgres:password@host.proxy.rlwy.net:port/railway?ssl=true
REQUIRE_DB_SSL=true
MIX_ENV=dev

# Temporary: Node/Webpack compatibility workaround (until dependencies upgraded)
NODE_OPTIONS=--openssl-legacy-provider

# Security (generate your own)
SECRET_KEY_BASE=3sBDZCKsYWQ2NEAW2hw9GIFEvxywgHxEvuCQ2u65zvdAoCV4EGBH00ho8NqDjeGob9Z5msNiFLBYe745obd6Vw==

# Application URLs
BACKEND_URL=http://localhost:4000
REACT_APP_URL=http://localhost:4000

# Production/Staging on Railway
# Railway injects DATABASE_URL and MIX_ENV=prod automatically
```

### Port Status (optional)
You can use `./dev.sh status` to see current listeners on 3000/4000 if needed.

Example warning:
```
⚠️  Port conflicts detected:
   Port 3000: PID 12345 (node)
   Port 4000: PID 67890 (beam.smp)
🧹 Killing conflicting processes...
```

## Production Deployment (Railway)

### Railway Configuration
- Uses main `Dockerfile` for production builds
- Uses Railway environment variables (DATABASE_URL, SECRET_KEY_BASE, etc.)
- Auto-deploys when you push to GitHub

### Safe to Push
- ✅ Development helpers (`dev.sh`, `docs/development.md`)
- ✅ Application code (`lib/`, `assets/`, `priv/`, `config/`)
- ✅ Documentation and scripts

### Development vs Production
- **Local Development**: 
  - Native Phoenix + CRA dev server (separate Terminal tabs on macOS)
  - Railway Postgres via `DATABASE_URL` (hosted, no local DB needed)
  - Hot reload for both Elixir and React code
  - `PageController` redirects to CRA dev server (port 3000) to prevent serving stale assets
- **Production**: 
  - Railway uses `Dockerfile` for containerized build
  - Railway's managed Postgres via `DATABASE_URL`
  - Serves compiled static assets from `priv/static/`
- **Database**: Managed by Railway Postgres (both dev and prod), configured via `DATABASE_URL`

### Deployment Flow
```
Local Dev (Railway Postgres) → Git Push → Railway Auto-Deploy → Live
    ./dev.sh start                  main         Dockerfile build
```