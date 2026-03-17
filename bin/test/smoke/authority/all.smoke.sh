#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/repos/infrastructure/docker-compose.yml"
AUTHORITY_ENV="$ROOT_DIR/repos/domain/identity/authority/.env"
SMOKE_DB_NAME="pulse-auth-smoke-$(date +%s)"
cd "$ROOT_DIR"

# Ensure authority .env is configured for smoke runtime isolation
cat > "$AUTHORITY_ENV" << EOF
PORT=7000
MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=$SMOKE_DB_NAME
JWT_SECRET=pulse-auth-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=pulse-auth-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=local.google.client
EOF

echo "Starting mongo + authority..."
docker compose -f "$COMPOSE_FILE" up -d --build mongo authority

echo "Waiting for authority service at http://localhost:7000..."
for i in {1..30}; do
  if curl -sS -o /dev/null -w "%{http_code}" -X GET "http://localhost:7000/authority/me" 2>/dev/null | grep -qE '^(200|401)$'; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Authority service did not become ready in time"
    docker compose -f "$COMPOSE_FILE" logs authority
    exit 1
  fi
  sleep 1
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running authority smoke tests..."
bash "$SCRIPT_DIR/signup.smoke.sh"
bash "$SCRIPT_DIR/login.smoke.sh"
bash "$SCRIPT_DIR/refresh.smoke.sh"
bash "$SCRIPT_DIR/logout.smoke.sh"
bash "$SCRIPT_DIR/google-signup.smoke.sh"
bash "$SCRIPT_DIR/google-login.smoke.sh"

echo "Authority smoke tests passed."
