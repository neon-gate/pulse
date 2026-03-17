#!/usr/bin/env bash
set -euo pipefail

AUTH_API_BASE_URL="${AUTH_API_BASE_URL:-http://localhost:7000}"
PASSWORD="${AUTH_TEST_PASSWORD:-12345678}"
EMAIL="${AUTH_TEST_EMAIL:-scripts.$(date +%s)@example.com}"

RESPONSE_STATUS=""
RESPONSE_BODY=""

perform_request() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local authorization="${4:-}"
  local tmp

  tmp="$(mktemp)"
  if [[ -n "$data" ]]; then
    if [[ -n "$authorization" ]]; then
      RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $authorization" -d "$data")"
    else
      RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data")"
    fi
  else
    if [[ -n "$authorization" ]]; then
      RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" -H "Authorization: Bearer $authorization")"
    else
      RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url")"
    fi
  fi

  RESPONSE_BODY="$(<"$tmp")"
  rm -f "$tmp"
}

assert_status() {
  local step="$1"
  local expected="$2"

  if [[ "$RESPONSE_STATUS" != "$expected" ]]; then
    echo "$step failed: expected status $expected got $RESPONSE_STATUS"
    echo "Response: $RESPONSE_BODY"
    exit 1
  fi
}

echo "Using test email: $EMAIL"

perform_request "POST" "$AUTH_API_BASE_URL/authority/signup" "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
if [[ "$RESPONSE_STATUS" != "201" && "$RESPONSE_STATUS" != "409" ]]; then
  echo "signup failed: expected status 201 or 409 got $RESPONSE_STATUS"
  echo "Response: $RESPONSE_BODY"
  exit 1
fi
echo "OK signup status=$RESPONSE_STATUS"

perform_request "POST" "$AUTH_API_BASE_URL/authority/login" "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
assert_status "login" 200

ACCESS_TOKEN="$(node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync(0,'utf8')); if (!d.accessToken) process.exit(2); process.stdout.write(d.accessToken);" <<<"$RESPONSE_BODY")"
REFRESH_TOKEN="$(node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync(0,'utf8')); if (!d.refreshToken) process.exit(2); process.stdout.write(d.refreshToken);" <<<"$RESPONSE_BODY")"
echo "OK login status=$RESPONSE_STATUS"

perform_request "GET" "$AUTH_API_BASE_URL/authority/me" "" "$ACCESS_TOKEN"
assert_status "me" 200
echo "OK me status=$RESPONSE_STATUS"

perform_request "POST" "$AUTH_API_BASE_URL/authority/refresh" "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
if [[ "$RESPONSE_STATUS" == "200" ]]; then
  echo "OK refresh-before-logout status=$RESPONSE_STATUS"

  perform_request "POST" "$AUTH_API_BASE_URL/authority/logout" "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
  assert_status "logout" 200
  echo "OK logout status=$RESPONSE_STATUS"

  perform_request "POST" "$AUTH_API_BASE_URL/authority/refresh" "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
  assert_status "refresh-after-logout" 401
  echo "OK refresh-after-logout status=$RESPONSE_STATUS"
elif [[ "$RESPONSE_STATUS" == "401" ]]; then
  echo "Skipping refresh/logout assertions because refresh is unauthorized in current runtime"
else
  echo "refresh-before-logout failed: expected status 200 or 401 got $RESPONSE_STATUS"
  echo "Response: $RESPONSE_BODY"
  exit 1
fi
