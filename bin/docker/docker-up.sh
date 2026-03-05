#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
API_AUTH_ENV_FILE="$ROOT_DIR/apps/bc-auth/micro-jwt-session/.env"
WEB_ENV_FILE_PATH="$ROOT_DIR/apps/web/.env.development"

TARGET="${1:-all}"

INFRA_SERVICES=(mongo redis rabbitmq nats)
APP_SERVICES=(micro-auth micro-player web)

case "$TARGET" in
  infra)
    docker compose -f "$COMPOSE_FILE" up -d --build "${INFRA_SERVICES[@]}"
    ;;
  apps)
    if [[ ! -f "$WEB_ENV_FILE_PATH" ]]; then
      echo "Missing apps/web/.env.development"
      exit 1
    fi
    if [[ ! -f "$API_AUTH_ENV_FILE" ]]; then
      echo "Missing apps/bc-auth/micro-jwt-session/.env"
      exit 1
    fi
    docker compose -f "$COMPOSE_FILE" up -d --build "${APP_SERVICES[@]}"
    ;;
  all)
    if [[ ! -f "$WEB_ENV_FILE_PATH" ]]; then
      echo "Missing apps/web/.env.development"
      exit 1
    fi
    if [[ ! -f "$API_AUTH_ENV_FILE" ]]; then
      echo "Missing apps/bc-auth/micro-jwt-session/.env"
      exit 1
    fi
    docker compose -f "$COMPOSE_FILE" up -d --build
    ;;
  *)
    echo "Usage: bash bin/docker/docker-up.sh [infra|apps|all]"
    exit 1
    ;;
esac
