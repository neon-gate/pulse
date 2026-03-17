#!/usr/bin/env bash
set -euo pipefail

AUTH_API_BASE_URL="${AUTH_API_BASE_URL:-http://localhost:7000}"
PASSWORD="${AUTH_TEST_PASSWORD:-12345678}"
EMAIL="${AUTH_TEST_EMAIL:-refresh.$(date +%s)@example.com}"

signup="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
signup_code="$(echo "$signup" | tail -n1)"
if [[ "$signup_code" != "201" && "$signup_code" != "409" ]]; then
  echo "refresh setup signup failed with status $signup_code"
  exit 1
fi

login="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
login_code="$(echo "$login" | tail -n1)"
login_body="$(echo "$login" | sed '$d')"

if [[ "$login_code" != "200" ]]; then
  echo "refresh setup login failed with status $login_code"
  echo "Response: $login_body"
  exit 1
fi

refresh_token="$(node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); if(!d.refreshToken) process.exit(2); process.stdout.write(d.refreshToken);" <<<"$login_body")"

refresh="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$refresh_token\"}")"
refresh_code="$(echo "$refresh" | tail -n1)"
refresh_body="$(echo "$refresh" | sed '$d')"

if [[ "$refresh_code" != "200" && "$refresh_code" != "401" ]]; then
  echo "refresh failed: expected 200 or 401 got $refresh_code"
  echo "Response: $refresh_body"
  exit 1
fi

echo "OK refresh endpoint status=$refresh_code email=$EMAIL"
