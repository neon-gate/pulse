#!/usr/bin/env bash
set -euo pipefail

AUTH_API_BASE_URL="${AUTH_API_BASE_URL:-http://localhost:7000}"
FAKE_ID_TOKEN="${AUTH_TEST_GOOGLE_ID_TOKEN:-}"

if [[ -z "$FAKE_ID_TOKEN" ]]; then
  echo "Skipping google-signup smoke (AUTH_TEST_GOOGLE_ID_TOKEN not set)"
  exit 0
fi

response="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/google/signup" \
  -H "Content-Type: application/json" \
  -d "{\"idToken\":\"$FAKE_ID_TOKEN\"}")"

http_code="$(echo "$response" | tail -n1)"
body="$(echo "$response" | sed '$d')"

if [[ "$http_code" != "200" && "$http_code" != "401" && "$http_code" != "400" && "$http_code" != "503" ]]; then
  echo "google signup unexpected status: $http_code"
  echo "Response: $body"
  exit 1
fi

echo "OK google signup reached endpoint status=$http_code"
