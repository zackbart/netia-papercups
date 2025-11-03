#!/bin/bash

# Native development helper for Papercups
# Usage: ./dev.sh [setup|start|stop|migrate|reset|test|format|build]

set -e

# Colors for log output
RESET_COLOR='\033[0m'
INFO_COLOR='\033[0;32m'
WARN_COLOR='\033[0;33m'

# Ensure asdf is loaded (for Erlang/Elixir/Node)
if [ -f /opt/homebrew/opt/asdf/libexec/asdf.sh ]; then
  . /opt/homebrew/opt/asdf/libexec/asdf.sh
fi

# Load .env file if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

cleanup() {
  echo -e "\n${WARN_COLOR}🛑 Stopping dev servers...${RESET_COLOR}"
  pkill -f "react-scripts" 2>/dev/null || true
  pkill -f "mix phx.server" 2>/dev/null || true
  exit 0
}

case "$1" in
  "setup")
    echo -e "${INFO_COLOR}🔧 Installing deps and setting up DB...${RESET_COLOR}"
    asdf install || true
    mix deps.get
    npm ci --prefix assets || npm i --prefix assets
    mix ecto.setup
    ;;

  "start")
    trap cleanup SIGINT SIGTERM EXIT
    echo -e "${INFO_COLOR}🚀 Starting Phoenix dev server (watcher will start CRA)...${RESET_COLOR}"

    # Ensure CRA binds to 3000 (avoid inheriting PORT=4000)
    unset PORT || true

    # Quick check: warn if ports are in use (non-blocking)
    if lsof -ti :4000 >/dev/null 2>&1 || lsof -ti :3000 >/dev/null 2>&1; then
      echo -e "${WARN_COLOR}⚠️  Ports 3000/4000 appear to be in use.${RESET_COLOR}"
      echo -e "${WARN_COLOR}   Run './dev.sh stop' first if needed.${RESET_COLOR}"
    fi

    # Ensure NODE_OPTIONS for CRA on modern Node
    export NODE_OPTIONS=${NODE_OPTIONS:---openssl-legacy-provider}

    # Ensure frontend deps exist (first run or after clean)
    if [ ! -d assets/node_modules ]; then
      echo -e "${INFO_COLOR}📦 Installing frontend deps (assets/)...${RESET_COLOR}"
      npm ci --prefix assets || npm i --prefix assets
    fi

    # Verify asdf node is in PATH (watcher needs it)
    if ! command -v node >/dev/null 2>&1; then
      echo -e "${WARN_COLOR}❌ 'node' not found. Run 'asdf install' first.${RESET_COLOR}"
      exit 1
    fi
    NODE_VERSION=$(node --version)
    echo -e "${INFO_COLOR}✅ Using Node ${NODE_VERSION} from asdf${RESET_COLOR}"

    # Start Phoenix; watcher in config/dev.exs spawns CRA (PATH is passed to watcher)
    iex -S mix phx.server
    ;;

  "migrate")
    echo -e "${INFO_COLOR}🗄️  Running database migrations...${RESET_COLOR}"
    mix ecto.migrate
    ;;

  "reset")
    echo -e "${WARN_COLOR}♻️  Resetting database (drop, create, migrate, seed)...${RESET_COLOR}"
    mix ecto.reset
    ;;

  "test")
    echo -e "${INFO_COLOR}🧪 Running tests...${RESET_COLOR}"
    mix test
    ;;

  "format")
    echo -e "${INFO_COLOR}✨ Formatting code...${RESET_COLOR}"
    mix format
    ;;

  "build")
    echo -e "${INFO_COLOR}🏗️  Building for production (Elixir + frontend)...${RESET_COLOR}"
    # Compile Elixir/Phoenix
    MIX_ENV=prod mix compile --force
    # Build frontend assets
    export NODE_OPTIONS=${NODE_OPTIONS:---openssl-legacy-provider}
    npm run build --prefix assets
    echo -e "${INFO_COLOR}✅ Build complete! Assets in priv/static/${RESET_COLOR}"
    ;;

  "stop")
    echo -e "${WARN_COLOR}🛑 Stopping dev servers...${RESET_COLOR}"
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    lsof -ti :4000 | xargs kill -9 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    pkill -f "mix phx.server" 2>/dev/null || true
    echo -e "${INFO_COLOR}✅ Stopped${RESET_COLOR}"
    ;;

  # Simple helper to view listeners
  "status")
    echo -e "${INFO_COLOR}📊 Port status:${RESET_COLOR}"
    lsof -i :3000 -sTCP:LISTEN -nP || true
    lsof -i :4000 -sTCP:LISTEN -nP || true
    ;;

  *)
    echo -e "${INFO_COLOR}📖 Papercups Development Helper${RESET_COLOR}"
    echo -e "${INFO_COLOR}📚 Documentation: docs/development.md${RESET_COLOR}"
    echo ""
    echo "Commands:"
    echo "  setup     - Install deps and set up DB"
    echo "  start     - Start Phoenix dev server (watcher starts CRA)"
    echo "  stop      - Stop all dev servers"
    echo "  migrate   - Run database migrations"
    echo "  reset     - Drop, create, migrate, seed"
    echo "  test      - Run tests"
    echo "  format    - Format Elixir code"
    echo "  build     - Build for production (Elixir + frontend)"
    ;;
esac
