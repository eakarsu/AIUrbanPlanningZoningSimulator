#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$PROJECT_DIR/.env" ]] || { echo "Missing .env runtime configuration." >&2; exit 1; }
set -a
# shellcheck disable=SC1091
source "$PROJECT_DIR/.env"
set +a

BACKEND_PORT="${BACKEND_PORT:?BACKEND_PORT is required}"
CLIENT_PORT="${FRONTEND_PORT:-${CLIENT_PORT:?CLIENT_PORT is required}}"
[[ "$BACKEND_PORT" != "$CLIENT_PORT" ]] || { echo "Backend and client ports must be different; no process was changed." >&2; exit 1; }
export PORT="$BACKEND_PORT" BACKEND_PORT CLIENT_PORT
export ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://127.0.0.1:$CLIENT_PORT,http://localhost:$CLIENT_PORT}"

for directory in "$PROJECT_DIR/node_modules" "$PROJECT_DIR/client/node_modules"; do
  [[ -d "$directory" ]] || { echo "Missing dependencies. Run ./scripts/bootstrap.sh explicitly." >&2; exit 1; }
done
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"
: "${OPENROUTER_API_KEY:?OPENROUTER_API_KEY is required}"
: "${OPENROUTER_MODEL:?OPENROUTER_MODEL is required}"
: "${OPENROUTER_BASE_URL:?OPENROUTER_BASE_URL is required}"
[[ ${#JWT_SECRET} -ge 32 ]] || { echo "JWT_SECRET must contain at least 32 characters." >&2; exit 1; }
[[ "${ALLOW_SCHEMA_MIGRATION:-}" == "true" || "${ALLOW_SCHEMA_MIGRATION:-}" == "1" ]] || { echo "ALLOW_SCHEMA_MIGRATION=true is required." >&2; exit 1; }

for port in "$BACKEND_PORT" "$CLIENT_PORT"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $port is already in use; no process was changed." >&2
    exit 1
  fi
done

node "$PROJECT_DIR/server/scripts/prepareRuntime.js"

backend_pid=""
client_pid=""
cleanup() {
  [[ -z "$client_pid" ]] || kill "$client_pid" 2>/dev/null || true
  [[ -z "$backend_pid" ]] || kill "$backend_pid" 2>/dev/null || true
  wait "$client_pid" "$backend_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(cd "$PROJECT_DIR" && PORT="$BACKEND_PORT" node server/index.js) &
backend_pid=$!
(cd "$PROJECT_DIR/client" && PORT="$CLIENT_PORT" REACT_APP_API_URL="http://127.0.0.1:$BACKEND_PORT/api" BROWSER=none npm start) &
client_pid=$!
echo "Governed zoning API: http://127.0.0.1:$BACKEND_PORT"
echo "Client: http://127.0.0.1:$CLIENT_PORT"
wait "$backend_pid" "$client_pid"
