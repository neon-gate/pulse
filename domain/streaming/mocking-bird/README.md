# :milky_way: Fort Minor — Streaming Service

Fort Minor is the **streaming service responsible for delivering playable media** to the Pulse client. It generates HLS playlists and segments from a local MP3 stub and exposes them through HTTP endpoints consumed by the Next.js BFF.

The service follows **Clean Architecture** (ports/adapters), uses **NestJS IoC**, and emits **events** through the platform event bus (NATS).

---

# ✅ Features

- `POST /fort-minor/start` to prepare a stream
- `GET /fort-minor/:trackId/playlist` for HLS playlist
- `GET /fort-minor/:trackId/segment/:segment` for `.ts` chunks
- `ffmpeg` transcoding via `child_process.spawn`
- Event emission on stream start and transcode completion
- No database required (filesystem only)

---

# API

## `POST /fort-minor/start`

Request:
```json
{ "trackId": "<uuid>" }
```

Response:
```json
{
  "trackId": "<uuid>",
  "playlistPath": "/fort-minor/<uuid>/playlist"
}
```

## `GET /fort-minor/:trackId/playlist`
Returns the `playlist.m3u8` file.

## `GET /fort-minor/:trackId/segment/:segment`
Returns a `.ts` segment.

---

# Events (NATS)

Published subjects:

- `streaming.fort-minor.stream.started`
- `streaming.fort-minor.transcode.completed`

Example payload:
```json
{
  "trackId": "<uuid>",
  "playlistPath": "/fort-minor/<uuid>/playlist",
  "occurredAt": "2026-03-10T12:00:00.000Z"
}
```

---

# Local Data

The service uses a stub MP3 located at:

```
./data/remember-the-name.mp3
```

Output is generated under:

```
./data/streams/<trackId>/
```

---

# Environment Variables

```bash
PORT=7002
NATS_URL=nats://localhost:4222
FORT_MINOR_DATA_DIR=
FORT_MINOR_OUTPUT_DIR=
```

---

# Requirements

- `ffmpeg` must be installed locally if running outside Docker.

---

# Testing

```bash
pnpm --filter @micro/fort-minor test
```
