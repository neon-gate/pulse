# :milky_way: Fort Minor — Streaming Service

Fort Minor is the **streaming service responsible for delivering playable media to clients**.

It exposes APIs that allow applications to:

- start playback
- retrieve playable track streams
- control streaming sessions

Fort Minor operates on **media assets produced by the Media bounded context**.

---

# Responsibilities

The service is responsible for:

- exposing playback APIs
- resolving playable track sources
- delivering streaming manifests
- integrating with the media catalog

---

# Architecture

Fort Minor follows a **microservice architecture** and acts as the **delivery layer of the media platform**.

Flow:

Client
↓  
Fort Minor (Streaming API)
↓  
Media Services
↓  
Storage / Transcoded Assets

---

# API Surface

Typical endpoints exposed by this service include:
```bash
GET /api/songs
GET /api/fort-minor/:trackId
```

Responsibilities:

### `/api/songs`

Returns available songs from the media catalog.

### `/api/fort-minor/:trackId`

Returns streaming information required to play a track.

This may include:

- HLS manifest
- stream URL
- playback metadata

---

# Dependencies

Fort Minor depends on:

- Media Metadata Service
- Track Storage
- Transcoded audio assets

---

# Technology

Typical stack:

- Node.js
- TypeScript
- HLS streaming
- HTTP APIs

---

# Context Role

Within the platform architecture:

Media Context
↓
Streaming Context
↓
Clients / Players

Fort Minor is the **bridge between stored media and user playback**.