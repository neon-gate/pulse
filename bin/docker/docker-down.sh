#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

TARGET="${1:-all}"

INFRA_SERVICES=(mongo redis rabbitmq nats)
APP_SERVICES=(micro-auth micro-player pulse)

case "$TARGET" in
  infra)
    docker compose -f "$COMPOSE_FILE" stop "${INFRA_SERVICES[@]}"
    docker compose -f "$COMPOSE_FILE" rm -f "${INFRA_SERVICES[@]}"
    ;;
  apps)
    docker compose -f "$COMPOSE_FILE" stop "${APP_SERVICES[@]}"
    docker compose -f "$COMPOSE_FILE" rm -f "${APP_SERVICES[@]}"
    ;;
  all)
    docker compose -f "$COMPOSE_FILE" down --remove-orphans --volumes
    ;;
  *)
    echo "Usage: bash bin/docker/docker-down.sh [infra|apps|all]"
    exit 1
    ;;
esac
