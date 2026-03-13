#!/usr/bin/env bash
set -euo pipefail

BACKSTAGE_URL="${BACKSTAGE_URL:-http://localhost:4001}"

response="$(curl -sS -w "\n%{http_code}" "$BACKSTAGE_URL/health")"
http_code="$(echo "$response" | tail -n1)"
body="$(echo "$response" | sed '$d')"

if [[ "$http_code" != "200" ]]; then
  echo "health check failed: expected 200, got $http_code"
  echo "Response: $body"
  exit 1
fi

status="$(node -e "
  const d = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  process.stdout.write(d.status);
" <<<"$body")"

if [[ "$status" != "ok" ]]; then
  echo "health check failed: expected status ok, got $status"
  exit 1
fi

echo "OK backstage health status=$http_code"
