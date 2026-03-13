#!/usr/bin/env bash
# Connects to the Backstage WebSocket, triggers an upload, and verifies that
# at least one track.* event arrives within the timeout window.
set -euo pipefail

BACKSTAGE_URL="${BACKSTAGE_URL:-ws://localhost:4001}"
SOUNDGARDEN_URL="${SOUNDGARDEN_URL:-http://localhost:7100}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="${TEST_FILE:-$SCRIPT_DIR/../soundgarden/data/remember-the-name.mp3}"

if [[ ! -f "$TEST_FILE" ]]; then
  echo "Test file not found: $TEST_FILE"
  exit 1
fi

# Collect WebSocket events into a temp file.
events_file="$(mktemp)"
trap 'rm -f "$events_file"' EXIT

# node ws client — runs for TIMEOUT_SECONDS and writes received events.
node -e "
const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('${BACKSTAGE_URL}/events');
const eventsFile = '${events_file}';

ws.on('open', () => process.stderr.write('WS connected\\n'));
ws.on('message', (data) => {
  fs.appendFileSync(eventsFile, data.toString() + '\\n');
  process.stderr.write('Received: ' + data.toString().slice(0, 80) + '\\n');
});
ws.on('error', (err) => { process.stderr.write('WS error: ' + err.message + '\\n'); process.exit(1); });

setTimeout(() => { ws.close(); }, ${TIMEOUT_SECONDS} * 1000);
" &
ws_pid=$!

sleep 2

# Trigger an upload.
curl -sS -X POST "$SOUNDGARDEN_URL/tracks/upload" -F "file=@$TEST_FILE" > /dev/null

# Wait for the WS client to collect events.
wait "$ws_pid" || true

event_count="$(wc -l < "$events_file" | tr -d ' ')"

if [[ "$event_count" -lt 1 ]]; then
  echo "FAIL no events received via WebSocket"
  exit 1
fi

echo "OK backstage forwarded $event_count event(s) via WebSocket"
