#!/usr/bin/env bash
# Connects to Backstage Socket.IO /pipeline namespace, waits for pipeline.event
# messages. In mock mode events arrive automatically; in real mode trigger
# upload via Soundgarden. Asserts ordered lifecycle progression for one track.
set -euo pipefail

BACKSTAGE_HTTP_URL="${BACKSTAGE_HTTP_URL:-http://localhost:4001}"
SOUNDGARDEN_URL="${SOUNDGARDEN_URL:-http://localhost:7100}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="${TEST_FILE:-$SCRIPT_DIR/../soundgarden/data/remember-the-name.mp3}"

events_file="$(mktemp)"
trap 'rm -f "$events_file"' EXIT

# Socket.IO client: connect to /pipeline, collect pipeline.event messages
node -e "
const { io } = require('socket.io-client');
const fs = require('fs');

const url = '${BACKSTAGE_HTTP_URL}';
const eventsFile = '${events_file}';
const timeoutMs = ${TIMEOUT_SECONDS} * 1000;

const socket = io(url + '/pipeline', {
  path: '/socket.io',
  transports: ['websocket']
});

socket.on('connect', () => process.stderr.write('Socket.IO connected to /pipeline\n'));
socket.on('pipeline.event', (data) => {
  fs.appendFileSync(eventsFile, JSON.stringify(data) + '\n');
  process.stderr.write('Received pipeline.event: ' + (data.event || '?') + '\n');
});
socket.on('error', (err) => {
  process.stderr.write('Socket.IO error: ' + err.message + '\n');
  process.exit(1);
});

setTimeout(() => { socket.close(); }, timeoutMs);
" &
ws_pid=$!

sleep 2

# Optionally trigger upload (when Soundgarden is reachable)
if [[ -f "$TEST_FILE" ]] && curl -sS -o /dev/null -w '%{http_code}' -X POST "${SOUNDGARDEN_URL}/tracks/upload" -F "file=@${TEST_FILE}" 2>/dev/null | grep -qE '^(200|400)$'; then
  echo "Triggered upload via Soundgarden" >&2
fi

# In mock mode, Backstage emits events on startup — no upload needed
# Just wait for the client to collect events
wait "$ws_pid" 2>/dev/null || true

event_count="$(wc -l < "$events_file" 2>/dev/null | tr -d ' ' || echo 0)"

if [[ "$event_count" -lt 1 ]]; then
  echo "FAIL no pipeline.event messages received via Socket.IO"
  exit 1
fi

node -e "
const fs = require('fs');
const lines = fs.readFileSync('${events_file}', 'utf8').trim().split('\n').filter(Boolean);
const byTrack = new Map();
for (const line of lines) {
  let data;
  try { data = JSON.parse(line); } catch { continue; }
  if (!data.trackId || !data.event) continue;
  const arr = byTrack.get(data.trackId) || [];
  arr.push(String(data.event));
  byTrack.set(data.trackId, arr);
}
if (!byTrack.size) {
  console.error('FAIL no valid pipeline events with trackId found');
  process.exit(1);
}
let bestTrackId = null;
let bestEvents = [];
for (const [trackId, events] of byTrack.entries()) {
  if (events.length > bestEvents.length) {
    bestTrackId = trackId;
    bestEvents = events;
  }
}
const requiredOrder = ['track.upload.received', 'track.uploaded'];
const terminalCandidates = ['track.hls.stored', 'track.rejected', 'track.upload.failed', 'track.transcoding.failed'];
let cursor = -1;
for (const eventName of requiredOrder) {
  const idx = bestEvents.indexOf(eventName, cursor + 1);
  if (idx === -1) {
    console.error('FAIL missing ordered lifecycle event', eventName, 'for track', bestTrackId);
    console.error('Events:', bestEvents.join(', '));
    process.exit(1);
  }
  cursor = idx;
}
const hasTerminal = terminalCandidates.some((evt) => bestEvents.includes(evt));
if (!hasTerminal) {
  console.error('FAIL missing terminal lifecycle event for track', bestTrackId);
  console.error('Expected one of:', terminalCandidates.join(', '));
  console.error('Events:', bestEvents.join(', '));
  process.exit(1);
}
process.stdout.write('OK ordered events for track=' + bestTrackId + ' count=' + bestEvents.length + '\n');
"

echo "OK backstage forwarded $event_count pipeline.event(s) via Socket.IO"
