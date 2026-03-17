#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/repos/infrastructure/docker-compose.yml"

TARGET="${1:-all}"

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

if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker-compose)
else
  echo "Docker Compose is not installed"
  exit 1
fi

case "$TARGET" in
  infra)
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" ps "${INFRA_SERVICES[@]}"
    ;;
  apps)
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" ps "${APP_SERVICES[@]}"
    ;;
  all)
    "${DOCKER_COMPOSE[@]}" -f "$COMPOSE_FILE" ps
    ;;
  *)
    echo "Usage: bash bin/docker/docker-ps.sh [infra|apps|all]"
    exit 1
    ;;
esac
