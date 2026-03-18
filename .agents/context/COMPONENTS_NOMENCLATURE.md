---
alwaysApply: true
---

# COMPONENTS NOMENCLATURE

This document defines the naming conventions and semantic structure used across the Pulse platform.

The goal is to ensure:

- Consistent naming across workspaces
- Clear domain boundaries
- Predictable folder structures
- A balance between business clarity and music-inspired references

Pulse is a Spotify-like music streaming platform built using a microservice architecture and agent-based AI cognition layer.

## Workspace Structure

The monorepo is organized into four primary workspaces.

```
apps/
agents/
packages/
domain/
```

Each workspace has different naming rules and philosophy.

---

## 1. Apps Workspace

```
apps/
 └── pulse/
```

**Naming Philosophy**

Applications use product-facing names, not internal references.

They represent user-facing software rather than infrastructure components.

**Rules**

- Names should reflect the product itself
- Avoid music references here unless they are part of the brand
- Keep names simple and recognizable

**Current Applications**

| App   | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| pulse | Frontend Next.js project; Player UI for the streaming platform   |

---

## 2. Agents Workspace

```
agents/
 └── shinoda/
```

**Naming Philosophy**

Agents are named after musicians or musical figures, inspired by the Linkin Park ecosystem.

These names represent AI personalities operating within the platform.

**Rules**

- Must reference artists or music culture
- Names should feel distinct and memorable
- Each agent represents a reasoning entity

**Current Agents**

| Agent   | Description                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------- |
| shinoda | Primary AI orchestration agent responsible for reasoning and coordination across services       |

---

## 3. Packages Workspace

```
packages/
 ├── kernel
 ├── event-bus
 ├── cache
 ├── patterns
 └── neon
```

**Naming Philosophy**

Packages are shared libraries and abstractions.

They must not use musical references because they are infrastructure-level utilities used across multiple contexts.

**Rules**

- Names must be clear and descriptive
- Avoid metaphors or artistic references
- Focus on what the package does

**Current Packages**

| Package        | Scope                     | Description                                                                                     |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| `@pack/kernel`    | All microservices, agents  | DDD primitives: Entity, ValueObject, EventBus, UseCase, AggregateRoot, EventMap. Framework-agnostic domain abstractions. |
| `@pack/event-bus` | Microservices, Shinod AI  | NATS adapters for event-driven messaging: publish/subscribe and queue consumer patterns.       |
| `@pack/cache`     | Microservices             | Redis cache adapter and `RedisLike` port for session and idempotency use cases.                 |
| `@pack/patterns`  | Microservices (e.g. Authority) | Resilience patterns: CircuitBreaker, CircuitBreakerState, timeout handling.              |
| `@pack/neon`      | Frontend (pulse app)      | Design system: PostCSS-built CSS, color tokens for UI theming.                                  |

These packages provide shared utilities used by all microservices and agents.

---

## 4. Domain Workspace

```
domain/
```

This workspace contains the bounded contexts of the platform.

Naming here follows Domain-Driven Design principles.

Two naming layers exist:

| Layer           | Naming Style          |
| --------------- | --------------------- |
| Bounded Context | Business terminology  |
| Microservice    | Music reference       |

**Example:**

```
domain/streaming/mockingbird
```

- `streaming` → bounded context
- `mockingbird` → microservice name

### Bounded Contexts

The platform currently includes the following contexts:

```
domain/
 ├── identity/
 ├── ai/
 ├── streaming/
 └── realtime/
```

Each context groups microservices responsible for a specific domain capability.

### Domain Folder Structure

```
domain/
 ├── identity/
 │   ├── authority
 │   └── slim-shady (planned)
 ├── ai/
 │   └── shinod-ai
 ├── streaming/
 │   ├── soundgarden
 │   ├── mockingbird
 │   └── hybrid-storage (planned)
 └── realtime/
     └── backstage
```

### Microservices Overview

| Microservice        | Path                            | Responsibility                                                          | Platform Role                                        |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| Authority           | domain/identity/authority       | Authentication, signup, login, OAuth, token/session management          | Identity and access control for the entire platform   |
| Slim Shady (planned)| domain/identity/slim-shady      | TBD                                                                     | Planned identity microservice                         |
| Soundgarden         | domain/streaming/soundgarden     | Accept uploads, validate files, generate Track IDs, emit ingestion events| Entry point of the ingestion pipeline                 |
| Shinod AI           | domain/ai/shinod-ai             | AI cognition layer for fingerprinting, transcription, and reasoning    | Validates tracks before streaming                    |
| Mockingbird         | domain/streaming/mockingbird     | Transcoding service converting uploaded audio into streaming formats    | Prepares tracks for delivery                          |
| Backstage           | domain/realtime/backstage       | Event subscription, pipeline monitoring, lifecycle history              | Observability and monitoring                          |
| Hybrid Storage (planned) | domain/streaming/hybrid-storage | Store uploaded and transcoded HLS playlist segments; deliver segments directly to players; expose URLs for HLS consumption | Hybrid store-and-deliver layer for streaming media |

### Hybrid Storage (Planned)

Hybrid Storage is a hybrid microservice: it both stores and delivers. It persists uploaded and transcoded HLS playlist segments (`.m3u8`, `.ts`) and serves them directly to players. Instead of separating storage and CDN, it exposes URLs for HLS consumption in one place.

---

## Naming References (Easter Eggs)

Microservices and AI modules use music-inspired names. This section explains the references so developers understand the nomenclature.

| Name       | Reference | Why it fits |
| ---------- | --------- | ----------- |
| **Mockingbird** | Eminem song; bird that mimics sounds | Transcoding mimics and transforms audio into different formats (MP3, HLS segments). The service "re-sings" the original in new formats. |
| **Slim Shady** | Eminem's alter ego | Planned identity microservice. References the artist's persona; naming TBD. |
| **Soundgarden** | Band name; literal: garden of sounds | A place where you can deposit audio files—an ingestion garden for uploaded tracks. |
| **Shinod AI** | Mike Shinoda (Linkin Park frontman) | Beyond vocals, Shinoda orchestrates LP's production. The AI microservice and agent orchestrate reasoning and coordination across the platform. |
| **Petrified** | Fort Minor song | Shinod AI module for fingerprinting. Name references Mike Shinoda's Fort Minor project; module "freezes" audio identity for comparison. |
| **Fort Minor** | Mike Shinoda's side project / outro album | Shinod AI module for transcription. References the artist's solo work; transcription extracts the "voice" from audio. |
| **Stereo** | Fort Minor song | Shinod AI module for AI reasoning (approve/reject). References dual-channel thinking: combining fingerprint and transcription to decide. |

**Note:** Petrified, Fort Minor, and Stereo are currently internal modules within Shinod AI. They may be split into separate microservices in the future.

---

## Shinod AI

```
domain/ai/shinod-ai
```

Shinod AI is the AI cognition system responsible for validating uploaded tracks before they enter the streaming pipeline.

It contains three internal modules, each referencing Mike Shinoda's Fort Minor project and song titles (Petrified, Fort Minor, Stereo). These may be split into separate microservices in the future.

### AI Modules

| Module   | Consumes                                  | Emits                                                                   | Responsibility                                                |
| -------- | ------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| Petrified | track.uploaded                             | track.petrified.generated, track.petrified.song.unknown, track.duplicate.detected, track.petrified.failed | Generate Chromaprint fingerprint and detect duplicates        |
| Fort Minor | track.petrified.generated                  | track.fort-minor.started, track.fort-minor.completed, track.fort-minor.failed | Transcribe audio and produce structured transcription data    |
| Stereo   | track.petrified.generated, track.fort-minor.completed | track.stereo.started, track.approved, track.rejected, track.stereo.failed | AI reasoning and final approval or rejection                  |

### AI Processing Flow

The ingestion pipeline works as follows:

```
track.uploaded
      │
      ▼
Petrified
      │
      ▼
track.petrified.generated
      │
      ├── Fort Minor (transcription)
      │
      └── Stereo (stores fingerprint)
              │
              ▼
Fort Minor completes
              │
              ▼
Stereo reasoning
              │
      ┌───────┴────────┐
      ▼                ▼
track.approved     track.rejected
      │
      ▼
Mockingbird (transcoding)
```

---

## Naming Philosophy Summary

| Workspace        | Naming Style            |
| ---------------- | ----------------------- |
| apps             | Product names           |
| agents           | Music artist references |
| packages         | Functional/descriptive names |
| domain contexts  | Business terminology    |
| microservices    | Music references        |

This separation ensures:

- Clarity for developers
- Expressive domain storytelling
- Consistent architecture
