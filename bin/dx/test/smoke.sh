#!/usr/bin/env bash
# Runs all domain smoke tests in sequence.
# Requires Docker. Each domain's all.smoke.sh brings up its services as needed.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SMOKE_DIR="$ROOT_DIR/bin/test/smoke"

cd "$ROOT_DIR"

echo "=== Contract checks ==="
bash "$ROOT_DIR/bin/dx/test/contracts.sh"

echo ""
echo "=== Smoke tests: authority ==="
bash "$SMOKE_DIR/authority/all.smoke.sh"

echo ""
echo "=== Smoke tests: soundgarden ==="
bash "$SMOKE_DIR/soundgarden/all.smoke.sh"

echo ""
echo "=== Smoke tests: backstage ==="
bash "$SMOKE_DIR/backstage/all.smoke.sh"

echo ""
echo "All smoke tests passed."
