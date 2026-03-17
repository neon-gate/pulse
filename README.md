# Pulse <img style="vertical-align: -0.125em;" src="docs/images/logo.svg" width="32"/>

>The app that hates your post-2000 songs. 😤

A distributed music streaming platform monorepo designed to explore production-grade architecture for Spotify-like experiences. The "post-2000 rejection" rule is an intentional product experiment used to exercise the event pipeline (Nirvana: yes, Justin Bieber: sorry).

If you try to hack it, you'll still run through validation, AI reasoning, and transcoding stages. All [Linkin Park](https://linkinpark.com/) songs are allowed though. Somebody put an `IF` in the code base, damn! :eyes:

<p align="center">
  <img src="/docs/images/readme-banner-lp.png" />
</p>

 This repository combines a Next.js frontend, domain microservices, and internal platform packages to deliver resilient streaming, modular domain design, and a fast developer workflow.


## Vision And Architectural Direction 🧭

Pulse is intentionally built around architectural separation and explicit boundaries:

- **Domain-Driven Design (DDD):** business capabilities are isolated in bounded contexts.
- **Clean Architecture layers:** services follow layered structure (`interface`, `application`, `domain`, `infra`) where applicable.
- **Ports and Adapters:** domain abstractions live in ports; infrastructure implementations are provided as adapters.
- **Event-Driven Architecture:** domain collaboration uses asynchronous messaging patterns with NATS.
- **Resilience by default:** shared circuit breaker and cache abstractions reduce failure blast radius.
- **Streaming-first UI design:** frontend is optimized for segmented media playback and independent UI updates.

This architecture aims to keep business logic independent from framework and infrastructure concerns, so services can evolve without becoming tightly coupled to Redis, NATS, MongoDB, or UI delivery choices.


---

## Monorepo Structure 🗂️

Pulse is a **pnpm workspace** monorepo coordinated by **Turborepo**. The workspace topology isn't incidental tooling — it is the architecture. pnpm enforces explicit dependency boundaries between packages and services. Turbo makes shared packages first-class build inputs, so every service compiles against the same DDD vocabulary without version drift.

```
pulse/
├── apps/                        # 🖥️  User-facing applications
│   └── pulse/                   #     Next.js 16 player UI + BFF
│
├── agents/                      # 🤖  AI orchestration agents
│   └── shinoda/                 #     Mastra-powered dev agent
│
├── packages/                    # 📦  Shared infrastructure libraries
│   ├── kernel/                  #     DDD primitives (Entity, UseCase, EventBus…)
│   ├── event-bus/               #     NATS adapter + queue consumer wiring
│   ├── cache/                   #     Redis cache abstraction
│   ├── patterns/                #     Circuit breaker + resilience patterns
│   ├── environment/             #     Typed env-var helpers
│   └── neon/                    #     Design tokens + PostCSS theme
│
├── domain/                      # 🔷  Bounded-context microservices
│   ├── identity/
│   │   ├── authority/           #     Auth, JWT, sessions, OAuth
│   │   └── slim-shady/          #     User profiles + preferences
│   ├── streaming/
│   │   ├── soundgarden/         #     Upload ingestion edge
│   │   ├── mockingbird/         #     MP3 transcoder
│   │   └── hybrid-storage/      #     HLS artifact persistence + delivery
│   ├── ai/
│   │   └── shinod-ai/           #     Fingerprinting, transcription, reasoning
│   └── realtime/
│       └── backstage/           #     Pipeline projection + Socket.IO broadcast
│
├── infrastructure/
│   └── docker/
│       └── docker-compose.yml   # 🐳  Full platform topology
│
└── agents/.agents/              # 📋  Agent context, skills, and plans
    ├── context/
    ├── plans/
    └── skills/
```

### Workspace Naming Philosophy

The naming convention is intentional and layered:

| Layer | Style | Rationale |
|---|---|---|
| `apps/` | Product names | User-facing — clarity over personality |
| `agents/` | Music artists (Linkin Park) | AI personalities deserve character |
| `packages/` | Functional/descriptive | Infrastructure must be self-evident |
| `domain/<context>/` | Business terminology | DDD bounded contexts in plain language |
| `domain/<context>/<service>` | Music references | Each service has a story (see [Nomenclature](#components-nomenclature-)) |

---

## Components Nomenclature 🎵

Every microservice name is a music reference. This isn't decoration — it's a signal that the service has a distinct identity and a single well-scoped responsibility.

| Service | Music Reference | Why It Fits |
|---|---|---|
| **Soundgarden** | Band name | A garden where you deposit audio — the ingestion entry point |
| **Mockingbird** | Eminem song | A bird that mimics sounds; the transcoder re-sings the original in new formats |
| **Slim Shady** | Eminem alter ego | The profile service hides behind the identity — a secondary persona |
| **Authority** | — | No alias needed; owns access control for the whole platform |
| **Shinod AI** | Mike Shinoda (Linkin Park) | Orchestrates everything — just like Shinoda orchestrates LP's production |
| **Petrified** | Fort Minor song | Freezes audio identity — the fingerprinting module |
| **Fort Minor** | Mike Shinoda's side project | Extracts the voice — the transcription module |
| **Stereo** | Fort Minor song | Dual-channel thinking: merges fingerprint + transcription to decide |
| **Backstage** | Venue metaphor | The place where the real show is observed, not performed |

> All Linkin Park songs pass the reasoning stage. Somebody put an `IF` in the codebase. 👀

---

## Architecture 🏛️

### Clean Architecture Per Service

Every microservice follows the same four-layer structure so the codebase stays navigable regardless of which service you're in:

```
<service>/
├── domain/          # Entities, Value Objects, Events, Ports (abstract classes)
├── application/     # Use Cases — extend UseCase from @repo/kernel
├── infra/           # DB adapters, NATS wiring, MinIO, Redis, config
└── interface/       # HTTP controllers, NATS consumers, guards, DTOs, pipes
```

**Ports are abstract classes, not TypeScript interfaces.** This is a deliberate convention enforced across the entire repo — it allows NestJS DI tokens to be derived from the port class itself, keeping the adapter wiring clean.

### Shared Packages (`@repo/*`)

Packages are the architectural glue. They're not utilities — they're the shared vocabulary that keeps every service structurally consistent.

| Package | Exports | Used By |
|---|---|---|
| `@repo/kernel` | `UseCase`, `Entity`, `AggregateRoot`, `ValueObject`, `Event`, `EventBus`, `UniqueEntityId`, `EventMap` | All microservices |
| `@repo/event-bus` | `NatsEventBusAdapter`, queue consumer, connection provider, drain service, no-op fallback | All event-driven services |
| `@repo/cache` | `RedisLike` port, Redis adapter | Shinod AI, others |
| `@repo/patterns` | `CircuitBreaker`, `CircuitBreakerState` | Authority, sync boundaries |
| `@repo/environment` | `requireStringEnvCompute`, `requireNumberEnvCompute` | Service bootstrap |
| `@repo/neon` | CSS design tokens, PostCSS theme | `apps/pulse` |

### Transport Model

Pulse is deliberately **not** a purely async platform. Each transport layer has a purpose:

| Transport | Used For |
|---|---|
| **HTTP** | Frontend → BFF, BFF → services, control-plane access |
| **NATS** | Async backend workflow orchestration between microservices |
| **Socket.IO** | Realtime pipeline visibility from Backstage → frontend |

---

## Frontend Architecture 🖥️

`apps/pulse` is a **Next.js 16 App Router** application. It acts simultaneously as the player UI and a lightweight **Backend for Frontend (BFF)** via `app/api` routes.

### Route Layout

```
app/
├── (public)/
│   └── (auth)/
│       ├── login/               # Public login page
│       └── signup/              # Public signup page
│
├── (protected)/
│   └── (player)/                # Authenticated player shell
│       ├── @gallery/            # Parallel slot — track gallery
│       ├── @uploader/           # Parallel slot — upload + reasoning UI
│       ├── @user-menu/          # Parallel slot — user profile menu
│       └── @now-playing/        # Parallel slot — active playback bar
│
└── api/                         # BFF proxy routes
    ├── authority/               # Login, signup forwarding
    ├── slim-shady/profile/      # Profile read/update proxy
    ├── soundgarden/tracks/      # Upload proxy
    └── transport/hls/           # HLS segment delivery
```

The parallel slot layout means each UI region is independently rendered and can update without re-mounting siblings — critical for maintaining smooth playback state while the uploader or gallery updates.

### State Management

- **Jotai** — atomic UI and application state, globally provided at the root layout
- **Jotai + Immer** — complex state mutations (upload progress, pipeline stage tracking)
- **Zod** — form validation on auth flows and upload inputs
- **Local domain interfaces** under `app/lib/state/domain` — typed wrappers over backend shapes

### BFF Proxy Routes

BFF routes are thin and deliberate — they don't add business logic, just:

- Create or forward `x-request-id` for tracing
- Validate request bodies on auth flows
- Proxy to the correct backend service URL
- Normalize errors for the frontend

### HLS Playback

The frontend uses **hls.js** (`^1.6.15`) to consume HLS streams delivered through `app/api/transport/hls`. Playback integrates with the **Media Session API** so OS-level media controls (lock screen, headphone buttons, notification shade) reflect the active track — artist, title, artwork, and transport controls all wired through `navigator.mediaSession`.

### Realtime Pipeline UI

The uploader slot connects to **Backstage** via Socket.IO:

```
NEXT_PUBLIC_BACKSTAGE_WS_URL      → ws://localhost:4001
NEXT_PUBLIC_BACKSTAGE_WS_NAMESPACE → /pipeline
```

Every `pipeline.event` message emitted by Backstage over Socket.IO drives the live reasoning UI — users can watch their track move through fingerprinting, transcription, and AI approval in realtime.

---

## Event Pipeline 🔄

The full track lifecycle — from the moment a user drops a file to the moment it plays — is an event graph across eight services.

### Full Pipeline: Upload → Playback

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER UPLOADS TRACK                         │
│                          apps/pulse (BFF)                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  HTTP POST /api/soundgarden/tracks
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SOUNDGARDEN                               │
│                     Upload ingestion edge                           │
│                                                                     │
│  track.upload.received  →  track.upload.validated                   │
│  track.upload.stored    →  track.uploaded  ──────────────────────┐  │
└─────────────────────────────────────────────────────────────────────┘
                                                                    │
                               ┌────────────────────────────────────┘
                               │  track.uploaded
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SHINOD AI — PETRIFIED                       │
│                   Acoustic fingerprinting module                    │
│                                                                     │
│  Chromaprint fingerprint  →  audio hash  →  duplicate check         │
│  track.petrified.generated  /  track.duplicate.detected             │
└──────────────┬──────────────────────────────┬───────────────────────┘
               │                              │
               │  track.petrified.generated   │  track.petrified.generated
               ▼                              ▼
┌──────────────────────────┐   ┌──────────────────────────────────────┐
│  SHINOD AI — FORT MINOR  │   │       SHINOD AI — STEREO             │
│  Transcription module    │   │  Waits for both signals              │
│                          │   │                                      │
│  OpenAI Whisper (audio)  │   │  ┌─── fingerprint state             │
│  + gpt-audio reasoning   │   │  └─── transcription state           │
│                          │   │            │                         │
│  track.fort-minor.*      │──▶│  GPT-4o reasoning                   │
└──────────────────────────┘   │                                      │
                               │  track.approved / track.rejected     │
                               └──────────────┬───────────────────────┘
                                              │
                          ┌───────────────────┘
                          │  track.approved
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          MOCKINGBIRD                                │
│                       Transcoding worker                            │
│                                                                     │
│  Downloads source from MinIO                                        │
│  128 kbps MP3  +  320 kbps MP3  →  HLS segmentation                │
│                                                                     │
│  track.transcoding.started  →  track.transcoding.completed          │
│  track.hls.generated  ──────────────────────────────────────────┐  │
└─────────────────────────────────────────────────────────────────────┘
                                                                    │
                               ┌────────────────────────────────────┘
                               │  track.hls.generated
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        HYBRID STORAGE                               │
│                  HLS persistence + delivery sink                    │
│                                                                     │
│  Persists .m3u8 playlists + .ts segments to MinIO                  │
│  track.hls.stored  ─────────────────────────────────────────────┐  │
└─────────────────────────────────────────────────────────────────────┘
                                                                    │
                               ┌────────────────────────────────────┘
                               │  track.hls.stored
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TRACK READY FOR PLAYBACK                         │
│                                                                     │
│  apps/pulse requests HLS manifest via BFF                          │
│  hls.js fetches segments → Media Session API wired                 │
│  OS media controls: artist / title / artwork / transport           │
└─────────────────────────────────────────────────────────────────────┘

           ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                               BACKSTAGE
           │          Observes ALL  track.*  events             │
                  Projects to MongoDB pipeline read-model
           │      Broadcasts  pipeline.event  over Socket.IO    │
            ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

### Event Naming Conventions

All NATS subjects follow **lowercase dot-delimited** patterns:

| Pattern | Example |
|---|---|
| `<domain>.<entity>.<state>` | `authority.user.signed_up` |
| `<entity>.<subentity>.<state>` | `user.profile.updated` |
| `track.<stage>.<state>` | `track.upload.received` |

The NATS subject **is** the event name string — `emit('track.uploaded', payload)` publishes to NATS subject `track.uploaded`. No mapping layer.

### Full Event Inventory

| Subject | Producer | Consumers |
|---|---|---|
| `authority.user.signed_up` | Authority | Slim Shady |
| `user.profile.created` | Slim Shady | Authority |
| `authority.user.logged_in` | Authority | Backstage |
| `authority.token.refreshed` | Authority | Backstage |
| `authority.user.logged_out` | Authority | Backstage |
| `track.upload.received` | Soundgarden | Backstage |
| `track.upload.validated` | Soundgarden | Backstage |
| `track.upload.stored` | Soundgarden | Backstage |
| `track.uploaded` | Soundgarden | Petrified, Backstage |
| `track.upload.failed` | Soundgarden | Backstage |
| `track.petrified.generated` | Petrified | Fort Minor, Stereo, Backstage |
| `track.petrified.song.unknown` | Petrified | Backstage |
| `track.duplicate.detected` | Petrified | Backstage |
| `track.petrified.failed` | Petrified | Backstage |
| `track.fort-minor.started` | Fort Minor | Backstage |
| `track.fort-minor.completed` | Fort Minor | Stereo, Backstage |
| `track.fort-minor.failed` | Fort Minor | Backstage |
| `track.stereo.started` | Stereo | Backstage |
| `track.approved` | Stereo | Mockingbird, Backstage |
| `track.rejected` | Stereo | Backstage |
| `track.stereo.failed` | Stereo | Backstage |
| `track.transcoding.started` | Mockingbird | Backstage |
| `track.transcoding.completed` | Mockingbird | Backstage |
| `track.transcoding.failed` | Mockingbird | Backstage |
| `track.hls.generated` | Mockingbird | Hybrid Storage, Backstage |
| `track.hls.stored` | Hybrid Storage | Backstage |

---

## AI Architecture 🧠

### Shinod AI Service

`domain/ai/shinod-ai` is one deployable NestJS service containing three event-driven internal modules that mirror a mini-pipeline. Each module has distinct event contracts and can be split into independent microservices as the platform matures.

```
Shinod AI
├── Petrified     → acoustic fingerprinting (Chromaprint / fpcalc)
├── Fort Minor    → speech-to-text transcription (OpenAI Whisper)
└── Stereo        → AI reasoning, approval/rejection (GPT-4o)
```

**Petrified** runs on every upload. It generates a Chromaprint fingerprint and an audio hash, checks for duplicates via Redis, and emits the fingerprint payload that unblocks both Fort Minor and Stereo.

**Fort Minor** transcribes the audio. Using OpenAI's Whisper model (via the AI SDK), it extracts lyrics, detects language, and produces structured transcription segments. The platform is also wired to support **gpt-audio** in the reasoning path — GPT-4o with audio input — enabling direct audio-to-reasoning flows without a separate transcription stage.

**Stereo** is the decision engine. It waits until both fingerprint state and transcription are present, then runs GPT-4o reasoning over the combined signals to emit `track.approved` or `track.rejected`. The pre-2000 product rule lives here — not as a hard-coded check but as a reasoning prompt, so the rule can be tuned, loosened, or entirely replaced without touching the pipeline plumbing.

### Agent Shinoda (Agentic Development) 🤖

`agents/shinoda` is a **Mastra**-based AI agent that acts as the platform's operational intelligence layer for developers. It is not a runtime microservice — it is a developer tool that connects to the same NATS event plane and service APIs used by the platform.

```
agents/
└── shinoda/
    └── src/
        ├── shinoda/
        │   ├── shinoda.agent.ts       # Agent identity + system prompt
        │   ├── tools/
        │   │   ├── analyse-pipeline   # Inspect pipeline state per trackId
        │   │   └── inspect-events     # Query NATS event history
        │   └── workflows/
        │       └── debug-pipeline     # Multi-step debug workflow
        ├── mastra/index.ts            # Mastra registration
        └── index.ts
```

Shinoda runs a local dev server via `mastra dev` on `http://localhost:4111` and is grounded in:

- **context documents** (`agents/.agents/context/`) — the full AI pipeline context
- **plans** (`agents/.agents/plans/`) — implementation roadmaps per milestone
- **skills** (`agents/.agents/skills/mastra/`) — Mastra SDK references and migration guides

The agent is designed to answer questions like:
- *"Why was this track rejected?"*
- *"What events were emitted for trackId X?"*
- *"Is the pipeline stalled after fingerprinting?"*

Shinoda is developer/operator-facing, not end-user-facing. It uses `openai/gpt-4o-mini` by default (cost-efficient for operational tooling) with a clear upgrade path to GPT-4o for deeper reasoning tasks.

---

## Runtime Infrastructure 🐳

### Services at a Glance

| Service | Port | Persistence | Role |
|---|---|---|---|
| `authority` | `7000` | MongoDB (`mongo`) | Auth, JWT, OAuth, sessions |
| `slim-shady` | `7400` | MongoDB (`mongo`) | User profiles |
| `soundgarden` | `7100` | `/tmp/uploads` + MinIO | Upload ingestion |
| `shinod-ai` | `7200` | MongoDB (`mongo-shinod-ai`), Redis, MinIO | AI pipeline |
| `mockingbird` | `7201` | `/tmp/hls` + MinIO | Transcoding |
| `hybrid-storage` | `7300` | `/tmp/hls` + MinIO | HLS persistence |
| `backstage` | `4001` | MongoDB (`mongo`) | Pipeline observation + Socket.IO |
| `pulse` | `3000` | Browser / Jotai | Frontend + BFF |

### Infrastructure Dependencies

| Dependency | Role |
|---|---|
| **MongoDB** (`mongo`, `mongo-shinod-ai`) | Two isolated Mongo instances — one for identity/realtime, one for AI cognition |
| **Redis** (`redis-shinoda`) | AI operational cache, idempotency, audio-hash deduplication |
| **NATS** (JetStream enabled) | Async event plane across all microservices |
| **MinIO** | Object storage: `uploads`, `fingerprints`, `transcripts`, `artifacts`, `transcoded` |

---

## Tooling & DX ⚙️

### One Command to Rule Them All

```bash
pnpm infra
```

This single command spins up the **entire platform** — all infrastructure dependencies (MongoDB ×2, Redis, NATS, MinIO with pre-seeded buckets) and all application services — using the `docker-compose.yml` under `infrastructure/docker/`. No manual service wiring required. MinIO buckets are bootstrapped automatically by `minio-init` on first run.

### Reset and Bootstrap

```bash
pnpm dx:env:template
```

Scans the monorepo for every `.env.template` file and generates `.env` files from them. Run this once after cloning to get a working local environment. Re-running it is safe — it restores any accidentally deleted or corrupted `.env` files without touching values you've already customized.

### Root `package.json` Scripts

| Script | Description |
|---|---|
| `pnpm infra` | Raise the entire docker environment (infra + all services) |
| `pnpm dx:env:template` | Generate `.env` files from all `.env.template` files in the monorepo |
| `pnpm dev` | Run all services in dev mode via Turborepo (requires infra already running) |
| `pnpm build` | Build all packages and services through the Turbo build graph |
| `pnpm lint` | Biome lint across the entire monorepo |
| `pnpm format` | Biome format with VCS-aware ignore rules |
| `pnpm typecheck` | TypeScript type-check across all workspaces |

### Turborepo Build Graph

Turbo treats shared packages as first-class build inputs. `@repo/kernel` must be built before any service that depends on it — Turbo infers and parallelizes this graph automatically. You never need to manually order package builds.

---

## Getting Started 🚀

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 22.13.0`
- **pnpm** `>= 10.30.3`  (`npm install -g pnpm`)
- **Docker** + **Docker Compose**

### 1. Clone the repository

```bash
git clone https://github.com/your-org/pulse.git
cd pulse
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Generate environment files

```bash
pnpm dx:env:template
```

This walks every workspace and generates `.env` files from `.env.template`. Fill in your secrets (OpenAI API key, MinIO credentials, JWT secrets) before starting services.

**Key variables to configure:**

| Variable | Where | Description |
|---|---|---|
| `OPENAI_API_KEY` | `domain/ai/shinod-ai/.env` | Required for Whisper transcription + GPT-4o reasoning |
| `AI_MODEL` | `shinod-ai/modules/stereo/.env` | Default: `gpt-4o-mini` |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | `infrastructure/minio/.env` | Object storage credentials |
| `NEXT_PUBLIC_BACKSTAGE_WS_URL` | `apps/pulse/.env` | Backstage Socket.IO URL |

### 4. Raise the entire environment

```bash
pnpm infra
```

That's it. This command:

1. 🔶 Starts MongoDB ×2 (authority/realtime + shinod-ai)
2. 🔴 Starts Redis (AI operational cache)
3. 🟢 Starts NATS with JetStream enabled
4. 🪣 Starts MinIO and pre-creates all required buckets (`uploads`, `fingerprints`, `transcripts`, `artifacts`, `transcoded`)
5. 🚀 Starts all eight application services with their health checks

Services are started in dependency order. Health checks ensure no service starts before its dependencies are ready.

### 5. Start the Agent (optional)

To run the Shinoda developer agent locally:

```bash
cd agents/shinoda
pnpm dev       # starts mastra dev server at http://localhost:4111
```

Open `http://localhost:4111` to interact with Shinoda — ask it about pipeline state, event history, or why a track was rejected.

---

## Running in Development Mode 🛠️

With infrastructure running, start all services in watch mode:

```bash
pnpm dev
```

Or start individual services:

```bash
# Frontend only
cd apps/pulse && pnpm dev

# A specific microservice
cd domain/streaming/soundgarden && pnpm dev
```

### Service URLs (local)

| Service | URL |
|---|---|
| Pulse (frontend) | http://localhost:3000 |
| Authority | http://localhost:7000 |
| Slim Shady | http://localhost:7400 |
| Soundgarden | http://localhost:7100 |
| Shinod AI | http://localhost:7200 |
| Mockingbird | http://localhost:7201 |
| Hybrid Storage | http://localhost:7300 |
| Backstage (HTTP + WS) | http://localhost:4001 |
| Shinoda Agent (Mastra) | http://localhost:4111 |
| MinIO Console | http://localhost:9001 |
| NATS Monitor | http://localhost:8222 |