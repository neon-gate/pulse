#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/repos/environment/docker/docker-compose.yml"
BACKSTAGE_ENV="$ROOT_DIR/repos/domain/realtime/backstage/.env"
BACKSTAGE_URL="${BACKSTAGE_URL:-http://localhost:4001}"
cd "$ROOT_DIR"

# Ensure backstage .env exists for Docker build and runtime
if [[ ! -f "$BACKSTAGE_ENV" ]]; then
  echo "Creating repos/domain/realtime/backstage/.env for smoke tests..."
  cat > "$BACKSTAGE_ENV" << 'EOF'
PORT=4001
NATS_URL=nats://nats:4222
MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=backstage
MOCK_MODE=true
EOF
fi

echo "Starting mongo + nats + backstage..."
docker compose -f "$COMPOSE_FILE" up -d --build mongo nats backstage

echo "Waiting for backstage at $BACKSTAGE_URL..."
for i in {1..30}; do
  if curl -sS -o /dev/null -w "%{http_code}" "$BACKSTAGE_URL/health" 2>/dev/null | grep -q '^200$'; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Backstage did not become ready in time"
    docker compose -f "$COMPOSE_FILE" logs backstage
    exit 1
  fi
  sleep 1
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running backstage smoke tests..."
bash "$SCRIPT_DIR/health.smoke.sh"

# ws-events requires soundgarden to be running (upload triggers events)
# Skip if SOUNDGARDEN_URL is unreachable
if curl -sS -o /dev/null -w "%{http_code}" -X POST "${SOUNDGARDEN_URL:-http://localhost:7100}/tracks/upload" 2>/dev/null | grep -qE '^(200|400)$'; then
  bash "$SCRIPT_DIR/ws-events.smoke.sh"
else
  echo "Skipping ws-events (soundgarden not reachable)"
fi

echo "Backstage smoke tests passed."
