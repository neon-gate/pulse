#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
TARGET="${1:-all}"

INFRA_SERVICES=(
  mongo
  mongo-reasoning
  redis-cognition
  nats
  minio-soundgarden
  minio-soundgarden-init
  minio-fingerprint
  minio-fingerprint-init
  minio-transcription
  minio-transcription-init
)
APP_SERVICES=(
  authority
  soundgarden
  backstage
  cognition-fake
  fingerprint
  transcription
  reasoning
  pulse
)
INFRA_ENV_FILES=(
  "$ROOT_DIR/infrastructure/minio/soundgarden/.env"
  "$ROOT_DIR/infrastructure/minio/fingerprint/.env"
  "$ROOT_DIR/infrastructure/minio/transcription/.env"
)
APP_ENV_FILES=(
  "$ROOT_DIR/domain/identity/authority/.env"
  "$ROOT_DIR/domain/ingestion/soundgarden/.env"
  "$ROOT_DIR/domain/realtime/backstage/.env"
  "$ROOT_DIR/domain/ai/fake-cognition/.env"
  "$ROOT_DIR/domain/ai/fingerprint/.env"
  "$ROOT_DIR/domain/ai/transcription/.env"
  "$ROOT_DIR/domain/ai/reasoning/.env"
  "$ROOT_DIR/apps/pulse/.env"
)

if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker-compose)
else
  echo "Docker Compose is not installed"
  exit 1
fi

require_env_files() {
  local missing=0

  for env_file in "$@"; do
    if [[ ! -f "$env_file" ]]; then
      echo "Missing ${env_file#$ROOT_DIR/}"
      missing=1
    fi
  done

  if [[ "$missing" -ne 0 ]]; then
    exit 1
  fi
}

case "$TARGET" in
  infra)
    require_env_files "${INFRA_ENV_FILES[@]}"
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans "${INFRA_SERVICES[@]}"
    ;;
  apps)
    require_env_files "${APP_ENV_FILES[@]}"
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans "${APP_SERVICES[@]}"
    ;;
  all)
    require_env_files "${INFRA_ENV_FILES[@]}" "${APP_ENV_FILES[@]}"
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans
    ;;
  *)
    echo "Usage: bash bin/docker/docker-up.sh [infra|apps|all]"
    exit 1
    ;;
esac
