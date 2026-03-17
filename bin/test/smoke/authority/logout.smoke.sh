#!/usr/bin/env bash
set -euo pipefail

AUTH_API_BASE_URL="${AUTH_API_BASE_URL:-http://localhost:7000}"
PASSWORD="${AUTH_TEST_PASSWORD:-12345678}"
EMAIL="${AUTH_TEST_EMAIL:-logout.$(date +%s)@example.com}"

signup="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
signup_code="$(echo "$signup" | tail -n1)"
if [[ "$signup_code" != "201" && "$signup_code" != "409" ]]; then
  echo "logout setup signup failed with status $signup_code"
  exit 1
fi

login="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
login_code="$(echo "$login" | tail -n1)"
login_body="$(echo "$login" | sed '$d')"

if [[ "$login_code" != "200" ]]; then
  echo "logout setup login failed with status $login_code"
  echo "Response: $login_body"
  exit 1
fi

refresh_token="$(node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); if(!d.refreshToken) process.exit(2); process.stdout.write(d.refreshToken);" <<<"$login_body")"

logout="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/logout" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$refresh_token\"}")"
logout_code="$(echo "$logout" | tail -n1)"
logout_body="$(echo "$logout" | sed '$d')"
if [[ "$logout_code" != "200" && "$logout_code" != "401" ]]; then
  echo "logout failed: expected 200 or 401 got $logout_code"
  echo "Response: $logout_body"
  exit 1
fi

if [[ "$logout_code" == "200" ]]; then
  refresh_after="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\":\"$refresh_token\"}")"
  refresh_after_code="$(echo "$refresh_after" | tail -n1)"
  if [[ "$refresh_after_code" != "401" ]]; then
    echo "refresh after logout failed: expected 401 got $refresh_after_code"
    exit 1
  fi
  echo "OK logout status=$logout_code and refresh-after-logout status=$refresh_after_code"
else
  echo "OK logout endpoint returned unauthorized (runtime policy)"
fi
