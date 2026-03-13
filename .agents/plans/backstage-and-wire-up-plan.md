# FEATURE PLAN

## Pulse Ingestion Pipeline Bring-Up (Soundgarden + Cognition + Backstage)

### Goal

**Build the Backstage microservice** and **wire up the entire environment** by faking the AI Cognition API. The outcome is a fully running Docker Compose stack: all components, databases, message broker (NATS), and services working together end-to-end.

---

### ROLE

You are a senior distributed systems engineer responsible for bringing the Pulse ingestion pipeline online for the first time.

Your objective is not to build full production features, but to wire together the system components and prove the architecture works end-to-end.

**Deliverable:** A fully runnable development environment where:

- uploads reach Soundgarden (via BFF or direct API)
- Soundgarden processes the upload
- events flow through the event bus (NATS)
- a **fake** AI Cognition Engine consumes the upload event
- reasoning events are emitted
- Backstage streams events to connected WebSocket clients

The pipeline must be observable and verifiable. **No UI/frontend implementation** — you will build your own.

---

## SYSTEM OBJECTIVE

Bring the following pipeline online:

```
Client (your UI)
   │
   ▼
Next.js BFF / API
   │
   ▼
Soundgarden
   │
   ▼
NATS Event Bus
   │
   ├── AI Cognition Engine (fake reasoning)
   │
   └── Backstage (event observability)
           │
           ▼
        WebSocket (events for your UI)
```

**The system must run completely using:** `docker compose up`

---

## CONSTRAINTS

This bring-up phase prioritizes architecture validation over functionality.

**Allowed shortcuts:**

- fake AI reasoning
- simple event payloads
- console-level observability
- temporary storage

**Not required:**

- real AI inference
- production storage
- transcoding
- distributed tracing
- authentication hardening
- scalability

---

## CORE SERVICES

The environment must run four services (no frontend — you build your own).

### 1 — NATS Event Bus

Responsible for all inter-service communication.

| | |
|---|---|
| **Image** | `nats:2` |
| **Expose port** | 4222 |

All services must connect using the existing event bus abstraction.

---

### 2 — Soundgarden

The ingestion microservice.

**Responsibilities:**

- accept file uploads
- validate files
- store temporarily
- emit ingestion events

**Events emitted:**

- `track.upload.received`
- `track.upload.validated`
- `track.upload.stored`
- `track.uploaded`
- `track.upload.failed`

**Temporary storage location:** `/tmp/uploads/{trackId}/file.mp3`

Soundgarden does not perform AI analysis. It only emits events.

---

### 3 — AI Cognition Engine (Fake)

This service **simulates** the AI reasoning pipeline. No real AI inference.

**Purpose:** Validate the event-driven architecture.

**Subscription:** `track.uploaded`

When an upload event arrives, the service simulates reasoning.

**Example timeline:**

```
track.reasoning.started
track.reasoning.step
track.reasoning.step
track.reasoning.completed
```

**Fake delays:** Use `setTimeout(...)` to simulate processing.

**Example reasoning steps:**

- `waveform_analysis`
- `fingerprint_generation`
- `song_detection`

The goal is to produce observable reasoning events.

---

## FAKE COGNITION PIPELINE

The Cognition service must subscribe to `track.uploaded`.

When an event is received, it must emit the following sequence.

**Step 1:** Emit `track.reasoning.started` → wait 1 second

**Step 2:** Emit `track.reasoning.step` (payload: `step: waveform_analysis`) → wait 1 second

**Step 3:** Emit `track.reasoning.step` (payload: `step: fingerprint_generation`) → wait 1 second

**Step 4:** Emit `track.reasoning.step` (payload: `step: song_detection`) → wait 1 second

**Step 5:** Emit `track.reasoning.completed` (payload: `result: song_detected`, `confidence: 0.92`)

This deterministic sequence ensures the pipeline produces predictable events for debugging.

---

### 4 — Backstage

Backstage acts as an event observability gateway.

**Responsibilities:**

- Subscribe to system events and forward them to connected clients

**Subscriptions:** `track.>` (NATS wildcard covering all track.* events)

**Transport layer:** WebSocket

**Architecture:** Backstage bridges NATS → WebSocket. Clients receive real-time event streams.

**Example message:**

```json
{
  "subject": "track.reasoning.step",
  "payload": { ... }
}
```

---

## EVENT FLOW

The expected event flow:

```
track.upload.received
track.upload.validated
track.upload.stored
track.uploaded
track.reasoning.started
track.reasoning.step
track.reasoning.step
track.reasoning.completed
```

Each event must be visible in:

- service logs
- Backstage (and thus any connected WebSocket client)

---

## EVENT PAYLOAD SCHEMAS

All events must include the following envelope structure:

```json
{
  "subject": "event.name",
  "timestamp": "ISO8601",
  "payload": {}
}
```

The event bus subject remains the primary routing key. The `subject` field in the envelope is included for observability when events are forwarded via WebSocket.

### track.upload.received

Emitted when Soundgarden receives the upload request.

```json
{
  "trackId": "uuid",
  "fileName": "remember-the-name.mp3",
  "receivedAt": "ISO8601"
}
```

### track.upload.validated

Emitted after file validation succeeds.

```json
{
  "trackId": "uuid",
  "fileName": "remember-the-name.mp3",
  "fileSize": 5242880,
  "mimeType": "audio/mpeg",
  "validatedAt": "ISO8601"
}
```

### track.upload.stored

Emitted after temporary storage.

```json
{
  "trackId": "uuid",
  "filePath": "/tmp/uploads/{trackId}/remember-the-name.mp3",
  "storedAt": "ISO8601"
}
```

### track.uploaded

This event starts the processing pipeline.

```json
{
  "trackId": "uuid",
  "filePath": "/tmp/uploads/{trackId}/remember-the-name.mp3",
  "fileName": "remember-the-name.mp3",
  "uploadedAt": "ISO8601"
}
```

### track.reasoning.started

Emitted when the cognition engine begins processing.

```json
{
  "trackId": "uuid",
  "stage": "audio-analysis",
  "startedAt": "ISO8601"
}
```

### track.reasoning.step

Intermediate reasoning step.

```json
{
  "trackId": "uuid",
  "step": "waveform_analysis",
  "timestamp": "ISO8601"
}
```

**Possible steps:** `waveform_analysis`, `fingerprint_generation`, `song_detection`

### track.reasoning.completed

Final reasoning event.

```json
{
  "trackId": "uuid",
  "result": "song_detected",
  "confidence": 0.92,
  "completedAt": "ISO8601"
}
```

---

## INFRASTRUCTURE SETUP

A development environment must be provided via `docker-compose.yml`.

**Services:**

- `nats`
- `soundgarden`
- `cognition` (fake)
- `backstage`
- `bff` (API for uploads; your UI will call this)

**Example ports:**

| Service | Port |
|---------|------|
| bff | 3001 |
| soundgarden | 4000 |
| backstage | 4001 |
| nats | 4222 |

All services must join the same Docker network.

---

## SOUNDGARDEN STORAGE

Inside Docker, `/tmp/uploads` disappears when the container restarts. Add a volume so uploads persist during development.

**Volume mount for Soundgarden:**

```yaml
soundgarden:
  volumes:
    - uploads:/tmp/uploads
```

**Define the volume:**

```yaml
volumes:
  uploads:
```

---

## DOCKER COMPOSE SKELETON

Baseline structure to avoid "compose doesn't wire up correctly" problems.

```yaml
version: "3.9"

services:
  nats:
    image: nats:2
    ports:
      - "4222:4222"

  soundgarden:
    build: ./domain/ingestion/soundgarden
    ports:
      - "4000:4000"
    depends_on:
      - nats
    volumes:
      - uploads:/tmp/uploads

  cognition:
    build: ./domain/ai-cognition/cognition-fake
    depends_on:
      - nats

  backstage:
    build: ./domain/observability/backstage
    ports:
      - "4001:4001"
    depends_on:
      - nats

  bff:
    build: ./apps/pulse
    ports:
      - "3001:3001"
    depends_on:
      - soundgarden

volumes:
  uploads:
```

Adjust build paths to match your project layout (`domain/ingestion/soundgarden`, etc.).

---

## UPLOAD ENDPOINT

Soundgarden must expose an upload endpoint so the smoke test works.

**Endpoint:** `POST /tracks/upload`

**Content-Type:** `multipart/form-data`

**Field:** `file` (audio file)

**Example curl:**

```bash
curl -F "file=@remember-the-name.mp3" http://localhost:4000/tracks/upload
```

This guarantees the smoke test procedure can trigger an upload.

---

## SERVICE DISCOVERY

Services should connect to NATS using:

```
nats://nats:4222
```

Docker service name acts as the hostname.

---

## WEBSOCKET INTERFACE

Backstage exposes a WebSocket endpoint: `ws://localhost:4001/events`

When a client connects, it should begin receiving event streams. No authentication required during this phase.

---

## WEBSOCKET EVENT FORMAT

Backstage must forward every NATS event to connected WebSocket clients.

**Clients must receive messages using the following structure:**

```json
{
  "type": "event",
  "subject": "track.reasoning.step",
  "timestamp": "ISO8601",
  "payload": {}
}
```

**Example message:**

```json
{
  "type": "event",
  "subject": "track.upload.stored",
  "timestamp": "2026-03-13T18:32:11Z",
  "payload": {
    "trackId": "018f4d9c...",
    "filePath": "/tmp/uploads/..."
  }
}
```

Backstage must forward events without modification except for adding the timestamp if not present.

---

## EVENT SUBSCRIPTIONS

**Backstage** must subscribe using the NATS wildcard `track.>` which covers:

- `track.upload.*`
- `track.reasoning.*`
- any future `track.*` events

Subscribe once instead of multiple subjects.

**Cognition** must subscribe only to:

- `track.uploaded`

**Soundgarden** must not subscribe to pipeline events. It is strictly a producer.

---

## SHARED EVENT LIBRARY (CRITICAL)

All services must use a shared package to avoid reimplementing the event envelope inconsistently.

**Package:** `packages/events`

**Responsibilities:**

- Event envelope type
- Event publishing helper
- Subject constants
- Serialization helpers

**Structure:**

```
packages/events/
├── subjects.ts
├── eventEnvelope.ts
├── publisher.ts
└── index.ts
```

**subjects.ts:**

```ts
export const Subjects = {
  TrackUploadReceived: "track.upload.received",
  TrackUploadValidated: "track.upload.validated",
  TrackUploadStored: "track.upload.stored",
  TrackUploaded: "track.uploaded",

  TrackReasoningStarted: "track.reasoning.started",
  TrackReasoningStep: "track.reasoning.step",
  TrackReasoningCompleted: "track.reasoning.completed",
};
```

**eventEnvelope.ts:**

```ts
export interface EventEnvelope<T = unknown> {
  subject: string;
  timestamp: string;
  payload: T;
}
```

**publisher.ts:**

```ts
import { EventEnvelope } from "./eventEnvelope";

export function createEvent(subject: string, payload: unknown): EventEnvelope {
  return {
    subject,
    timestamp: new Date().toISOString(),
    payload,
  };
}
```

All services emit consistent events via this package.

---

## NATS CLIENT INITIALIZATION

Each service must initialize a NATS client during startup the same way.

**Example using nats.js:**

```ts
import { connect, StringCodec } from "nats";

export const sc = StringCodec();

export async function connectNats() {
  const nc = await connect({
    servers: "nats://nats:4222",
  });

  console.log("Connected to NATS");
  return nc;
}
```

**Publishing** (consistent encoding across all services):

```ts
await nc.publish(subject, sc.encode(JSON.stringify(event)));
```

Each service should expose `/lib/nats.ts` (or equivalent) for consistent connection behavior. Without `StringCodec`, event encoding becomes inconsistent.

---

## BACKSTAGE EVENT BROADCASTING

Backstage must maintain a list of connected WebSocket clients and broadcast to all on each NATS event.

**Architecture:**

```
NATS
  │
  ▼
Backstage Subscriber
  │
  ▼
Broadcast Layer
  │
  ▼
Connected WebSocket Clients
```

**Client registry:**

```ts
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => {
    clients.delete(ws);
  });
});
```

**Broadcast helper:**

```ts
function broadcast(event: object) {
  const message = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
```

**NATS subscription:**

```ts
const sub = nc.subscribe("track.>");
const sc = StringCodec();

for await (const msg of sub) {
  const event = JSON.parse(sc.decode(msg.data));
  broadcast({
    type: "event",
    ...event,
  });
}
```

---

## HEALTH ENDPOINTS

Each service must expose a simple health check for quick verification during bring-up.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok"
}
```

**Verification:**

```bash
curl localhost:4000/health   # Soundgarden
curl localhost:4001/health   # Backstage
curl localhost:4222           # NATS (if applicable)
```

---

## LOGGING FORMAT (RECOMMENDED)

Use structured, prefixed logs so you can trace the pipeline easily during debugging.

**Example format:**

```
[Soundgarden] Emitted track.uploaded trackId=123
[Cognition] Processing trackId=123
[Backstage] Forwarding track.reasoning.step
```

This dramatically helps debugging when multiple services log to the same output.

---

## DEVELOPMENT TEST

A smoke test must be possible using the provided mock file: `remember-the-name.mp3`

**Test procedure:**

1. Start the environment: `docker compose up`
2. Trigger an upload (e.g. `curl` to BFF/Soundgarden, or your own UI)
3. Verify:

**Soundgarden logs:**

- upload received
- upload validated
- file stored
- event emitted

**Cognition logs:**

- reasoning started
- reasoning step
- reasoning step
- reasoning completed

**Backstage logs:**

- event received
- event forwarded

**WebSocket clients:** Events stream in real time to any connected client.

---

## SUCCESS CRITERIA

The bring-up is successful if:

- Soundgarden accepts file uploads
- events are emitted to NATS
- Cognition (fake) consumes events
- reasoning events are produced
- Backstage receives events and streams them to WebSocket clients

This proves the Pulse ingestion architecture works end-to-end with all components, databases, and the message broker running under Docker Compose.

---

## SYSTEM BRING-UP CHECKLIST

Verify the system in the following order.

**1 — Start infrastructure**

```bash
docker compose up
```

Verify NATS starts successfully.

**2 — Verify Soundgarden connection**

Soundgarden logs should show: `Connected to NATS`

**3 — Verify Cognition subscription**

Cognition logs should show: `Subscribed to track.uploaded`

**4 — Verify Backstage subscriptions**

Backstage logs should show: `Subscribed to track.>`

**5 — Verify WebSocket server**

Backstage must expose `ws://localhost:4001/events`. Confirm clients can connect.

**6 — Trigger an upload**

Upload the mock file `remember-the-name.mp3`. Verify Soundgarden emits:

- `track.upload.received`
- `track.upload.validated`
- `track.upload.stored`
- `track.uploaded`

**7 — Verify Cognition pipeline**

Cognition must emit:

- `track.reasoning.started`
- `track.reasoning.step`
- `track.reasoning.step`
- `track.reasoning.step`
- `track.reasoning.completed`

**8 — Verify Backstage forwarding**

Backstage logs must show events being forwarded to WebSocket clients.

---

## IMPORTANT NOTE

**The frontend/UI implementation is out of scope for this plan.**

Backstage must only provide `ws://localhost:4001/events`. Any client capable of opening a WebSocket connection may consume the event stream.

---

## NON-GOALS

This phase intentionally excludes:

- audio transcoding
- long-term storage
- AI inference
- music recognition
- distributed tracing
- auth integration
- scaling

Those features will be added after the pipeline is proven.
