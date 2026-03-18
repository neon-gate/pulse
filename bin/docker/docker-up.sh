#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/repos/environment/docker/docker-compose.yml"

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
  shinoda
)
APP_ENV_FILES=(
  "$ROOT_DIR/repos/domain/identity/authority/.env"
  "$ROOT_DIR/repos/domain/identity/slim-shady/.env"
  "$ROOT_DIR/repos/domain/streaming/soundgarden/.env"
  "$ROOT_DIR/repos/domain/realtime/backstage/.env"
  "$ROOT_DIR/repos/domain/ai/shinod-ai/.env"
  "$ROOT_DIR/repos/domain/streaming/mockingbird/.env"
  "$ROOT_DIR/repos/domain/streaming/hybrid-storage/.env"
  "$ROOT_DIR/repos/apps/pulse/.env"
  "$ROOT_DIR/repos/agents/shinoda/.env"
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

# Remove orphaned containers that conflict with our container_name values.
# Handles containers left from previous runs with different project context (e.g. before repos/ move).
CONFLICT_NAMES=(minio minio-init mongo-authority mongo-shinod-ai redis-shinoda nats authority slim-shady soundgarden backstage shinod-ai mockingbird pulse hybrid-storage)
for name in "${CONFLICT_NAMES[@]}"; do
  if docker ps -a -q -f "name=^${name}$" 2>/dev/null | grep -q .; then
    # Only remove if not part of our compose project (orphan)
    project=$(docker inspect "$name" --format '{{index .Config.Labels "com.docker.compose.project"}}' 2>/dev/null || echo "")
    if [[ -z "$project" || "$project" != "docker" ]]; then
      echo "Removing orphaned container: $name"
      docker rm -f "$name" 2>/dev/null || true
    fi
  fi
done

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
