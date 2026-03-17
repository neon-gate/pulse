#!/usr/bin/env bash
set -euo pipefail

AUTH_API_BASE_URL="${AUTH_API_BASE_URL:-http://localhost:7000}"
PASSWORD="${AUTH_TEST_PASSWORD:-12345678}"
EMAIL="${AUTH_TEST_EMAIL:-signup.$(date +%s)@example.com}"

response="$(curl -sS -w "\n%{http_code}" -X POST "$AUTH_API_BASE_URL/authority/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"

http_code="$(echo "$response" | tail -n1)"
body="$(echo "$response" | sed '$d')"

if [[ "$http_code" != "201" && "$http_code" != "409" ]]; then
  echo "signup failed: expected 201 or 409, got $http_code"
  echo "Response: $body"
  exit 1
fi

echo "OK signup status=$http_code email=$EMAIL"
