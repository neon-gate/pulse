# 🔐 Authentication Service

The Authentication service provides **secure identity access** for Pulse, including email/password auth, Google OAuth login/signup, JWT issuance, refresh token rotation, and session persistence.

It follows **Clean Architecture** with strict separation of concerns and ports/adapters, and uses an **event-driven** model for cross-service communication.

---

# ✅ Features

- **Email/password signup + login**
- **Google signup + login** (Apple removed)
- **JWT access tokens** (short lived)
- **Refresh token rotation** with session tracking
- **Session persistence in MongoDB** (Mongoose)
- **Event publication** on user and token lifecycle
- **Circuit breaker** around Google token verification
- **Zod validation** at HTTP boundaries (pipes + guards)

---

# API

Base path: `/auth`

## `POST /auth/signup`
Email/password signup (auto-creates session + tokens).

Request:
```json
{
  "email": "user@pulse.local",
  "password": "Password123",
  "name": "Optional Name"
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## `POST /auth/login`
Email/password login.

Request:
```json
{
  "email": "user@pulse.local",
  "password": "Password123"
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## `POST /auth/google/signup`
Google signup using an **ID Token** from Google Identity Services.

Request:
```json
{
  "idToken": "<google-id-token>"
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## `POST /auth/google/login`
Google login using an **ID Token**.

Request:
```json
{
  "idToken": "<google-id-token>"
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## `POST /auth/refresh`
Refreshes tokens and **rotates the refresh token**.

Request:
```json
{
  "refreshToken": "..."
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## `POST /auth/logout`
Revokes the current session.

Request:
```json
{
  "refreshToken": "..."
}
```

Response:
```json
{
  "success": true
}
```

## `GET /auth/me`
Returns the authenticated profile.

Response:
```json
{
  "id": "...",
  "email": "user@pulse.local",
  "name": "Optional Name",
  "provider": "password",
  "createdAt": "2026-03-10T12:00:00.000Z"
}
```

---

# Events (Event-Driven Architecture)

This service **publishes domain events** via the platform event bus. These are emitted on authentication lifecycle changes and are **safe to consume asynchronously**.

Event subjects are the exact event names below.

## Published Events

- `auth.user.signed_up`
- `auth.user.logged_in`
- `auth.user.logged_out`
- `auth.token.refreshed`

## Payloads

### `auth.user.signed_up`
```json
{
  "userId": "...",
  "email": "user@pulse.local",
  "provider": "google",
  "name": "Optional Name",
  "occurredAt": "2026-03-10T12:00:00.000Z"
}
```

### `auth.user.logged_in`
```json
{
  "userId": "...",
  "email": "user@pulse.local",
  "provider": "password",
  "sessionId": "...",
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "occurredAt": "2026-03-10T12:00:00.000Z"
}
```

### `auth.token.refreshed`
```json
{
  "userId": "...",
  "sessionId": "...",
  "occurredAt": "2026-03-10T12:00:00.000Z"
}
```

### `auth.user.logged_out`
```json
{
  "userId": "...",
  "sessionId": "...",
  "occurredAt": "2026-03-10T12:00:00.000Z"
}
```

---

# Consuming Events

The service uses the platform **EventBus abstraction** (`packages/event-bus`) with the **NATS adapter** (`packages/event-bus-nats`).

Subscribe by listening on the exact subject name:

```ts
import { connect } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus-nats'

const nc = await connect({ servers: process.env.NATS_URL })
const bus = new NatsEventBusAdapter(nc)

bus.on('auth.user.logged_in', async (payload) => {
  // react in your service
})
```

---

# Sessions (MongoDB + Mongoose)

Sessions are persisted in MongoDB and keyed by `sessionId` (JWT `sid` claim). This enables:

- refresh token rotation
- explicit session revocation
- multi-session support

Session fields include:

- `userId`
- `refreshTokenHash`
- `expiresAt` (TTL indexed)
- `ipAddress`
- `userAgent`
- `provider`

---

# Architecture

The service is structured following Clean Architecture:

- **interface**: HTTP controllers, pipes, guards
- **application**: use cases + token orchestration
- **domain**: entities, value objects, ports, events
- **infra**: Mongoose adapters, NATS event bus, Google OAuth adapter

Ports are injected via Nest IoC, preserving **SoC**, **SOLID**, and **Hexagonal** constraints.

---

# Security Notes

- `JWT_SECRET` and `JWT_REFRESH_SECRET` should be **32+ characters**.
- Refresh token rotation is enforced on `/auth/refresh`.
- Google tokens are verified via `google-auth-library` behind a circuit breaker.
- Inputs are validated with Zod at API boundaries.

---

# Environment Variables

```bash
PORT=
MONGO_URI=
MONGO_DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
NATS_URL=
GOOGLE_CLIENT_ID=
AXIOM_DATASET=
AXIOM_API_TOKEN=
AXIOM_BASE_URL=
AXIOM_SERVICE_NAME=
```

---

# Testing

Unit tests use **Jest** with Nest TestingModule:

```bash
pnpm --filter @micro/jwt-session test
```
