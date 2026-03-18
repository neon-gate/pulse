#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/repos/environment/docker/docker-compose.yml"
SOUNDGARDEN_API_BASE_URL="${SOUNDGARDEN_API_BASE_URL:-http://localhost:7100}"
SOUNDGARDEN_ENV="$ROOT_DIR/repos/domain/streaming/soundgarden/.env"

cd "$ROOT_DIR"

# Ensure soundgarden .env aligns with local smoke infra buckets.
cat > "$SOUNDGARDEN_ENV" << 'EOF'
PORT=7100
NATS_URL=nats://nats:4222
UPLOAD_MAX_SIZE_BYTES=52428800
UPLOAD_STORAGE_PATH=/tmp/uploads
UPLOAD_STORAGE_BUCKET=uploads
STORAGE_ENDPOINT=http://minio:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
PETRIFIED_STORAGE_ENDPOINT=http://minio:9000
PETRIFIED_STORAGE_REGION=us-east-1
PETRIFIED_STORAGE_ACCESS_KEY=minioadmin
PETRIFIED_STORAGE_SECRET_KEY=minioadmin
PETRIFIED_STORAGE_BUCKET=uploads
FORT_MINOR_STORAGE_ENDPOINT=http://minio:9000
FORT_MINOR_STORAGE_REGION=us-east-1
FORT_MINOR_STORAGE_ACCESS_KEY=minioadmin
FORT_MINOR_STORAGE_SECRET_KEY=minioadmin
FORT_MINOR_STORAGE_BUCKET=uploads
EOF

echo "Starting soundgarden..."
docker compose -f "$COMPOSE_FILE" up -d --build soundgarden

echo "Waiting for soundgarden at $SOUNDGARDEN_API_BASE_URL..."
for i in {1..30}; do
  if curl -sS -o /dev/null -w "%{http_code}" -X POST "$SOUNDGARDEN_API_BASE_URL/tracks/upload" 2>/dev/null | grep -qE '^(200|400)$'; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Soundgarden did not become ready in time"
    docker compose -f "$COMPOSE_FILE" logs soundgarden
    exit 1
  fi
  sleep 1
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running soundgarden smoke tests..."
bash "$SCRIPT_DIR/upload.smoke.sh"

if curl -sS -o /dev/null -w "%{http_code}" "${BFF_URL:-http://localhost:3000}" 2>/dev/null | grep -qE '^(200|30[1278]|404)$'; then
  bash "$SCRIPT_DIR/bff-upload.smoke.sh"
else
  echo "Skipping BFF upload smoke (Pulse BFF not reachable)"
fi

echo "Soundgarden smoke tests passed."
