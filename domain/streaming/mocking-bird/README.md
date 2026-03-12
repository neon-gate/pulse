# :milky_way: Mockingbird — Streaming Service

Mockingbird is the **streaming service responsible for delivering playable media** to the Pulse client. It generates HLS playlists and segments from a local MP3 stub and exposes them through HTTP endpoints consumed by the Next.js BFF.

The service follows **Clean Architecture** (ports/adapters), uses **NestJS IoC**, and emits **events** through the platform event bus (NATS).

---

# ✅ Features

- `POST /mocking-bird/start` to prepare a stream
- `GET /mocking-bird/:trackId/playlist` for HLS playlist
- `GET /mocking-bird/:trackId/segment/:segment` for `.ts` chunks
- `ffmpeg` transcoding via `child_process.spawn`
- Event emission on stream start and transcode completion
- No database required (filesystem only)

---

# API

## `POST /mocking-bird/start`

Request:
```json
{ "trackId": "<uuid>" }
```

Response:
```json
{
  "trackId": "<uuid>",
  "playlistPath": "/mocking-bird/<uuid>/playlist"
}
```

## `GET /mocking-bird/:trackId/playlist`
Returns the `playlist.m3u8` file.

## `GET /mocking-bird/:trackId/segment/:segment`
Returns a `.ts` segment.

---

# Events (NATS)

Published subjects:

- `streaming.mocking-bird.stream.started`
- `streaming.mocking-bird.transcode.completed`

Example payload:
```json
{
  "trackId": "<uuid>",
  "playlistPath": "/mocking-bird/<uuid>/playlist",
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
MOCKINGBIRD_DATA_DIR=
MOCKINGBIRD_OUTPUT_DIR=
```

---

# Requirements

- `ffmpeg` must be installed locally if running outside Docker.

---

# Testing

```bash
pnpm --filter @micro/mocking-bird test
```
