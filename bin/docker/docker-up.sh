#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

BOOTSTRAP=0
ARGS=()
for arg in "$@"; do
  if [[ "$arg" == "--bootstrap" || "$arg" == "-b" ]]; then
    BOOTSTRAP=1
  else
    ARGS+=("$arg")
  fi
done
TARGET="${ARGS[0]:-all}"

INFRA_SERVICES=(
  mongo
  mongo-shinod-ai
  redis-shinoda
  nats
  minio
  minio-init
)
APP_SERVICES=(
  authority
  soundgarden
  backstage
  shinod-ai
  mockingbird
  pulse
)
APP_ENV_FILES=(
  "$ROOT_DIR/domain/identity/authority/.env"
  "$ROOT_DIR/domain/streaming/soundgarden/.env"
  "$ROOT_DIR/domain/realtime/backstage/.env"
  "$ROOT_DIR/domain/ai/shinod-ai/.env"
  "$ROOT_DIR/domain/streaming/mockingbird/.env"
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

if [[ "$BOOTSTRAP" -eq 1 ]]; then
  echo "Bootstrapping .env from templates..."
  (cd "$ROOT_DIR" && pnpm dx:env:template)
fi

case "$TARGET" in
  infra)
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans "${INFRA_SERVICES[@]}"
    ;;
  apps)
    require_env_files "${APP_ENV_FILES[@]}"
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans "${APP_SERVICES[@]}"
    ;;
  all)
    require_env_files "${APP_ENV_FILES[@]}"
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --remove-orphans
    ;;
  *)
    echo "Usage: bash bin/docker/docker-up.sh [--bootstrap|-b] [infra|apps|all]"
    exit 1
    ;;
esac
