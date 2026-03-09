# 🔌 API Layer (BFF) — Architecture Guide

This folder contains the **Backend-for-Frontend (BFF)** layer used by the Next.js application.
Its purpose is to expose **stable HTTP endpoints for the UI** while delegating business logic to the domain microservices.

The BFF **does not contain domain logic**. Instead, it:

* validates requests
* orchestrates calls to domain services
* maps domain responses to UI responses
* centralizes transport concerns (HTTP errors, guards, validation)

---

# Responsibilities of the API Layer

The API layer acts as a **thin orchestration boundary between the frontend and the domain services**.

Main responsibilities:

* Request validation
* Authentication/session verification
* Delegating calls to domain microservices
* Formatting responses for the UI
* Handling HTTP errors consistently

The API layer **must remain lightweight** and should never contain core business rules.

---

# Domain Mapping

Each route in this layer corresponds to a **bounded context in the domain layer**.

| API Route                   | Bounded Context | Microservice              |
| --------------------------- | --------------- | ------------------------- |
| `/api/auth`                 | Identity        | `identity/authentication` |
| `/api/songs`                | Media           | `media/metadata`          |
| `/api/tracks`               | Media           | `media/tracks`            |
| `/api/streaming/fort-minor` | Streaming       | `streaming/fort-minor`    |

Example flow:

Client → Next.js API → Domain microservice

---

# Folder Structure

```
api/
├── index.ts
├── auth/
├── streaming/
└── transport/
```

### `index.ts`

Domain barrel used to expose all API modules.

This allows other parts of the application to import the API layer consistently.

---

# Auth Domain

```
auth/
├── index.ts
└── login/
```

The auth module communicates with the **Identity bounded context**.

Example endpoint:

```
POST /api/auth/login
```

Typical flow:

```
Client
 ↓
API route
 ↓
Login service
 ↓
Identity microservice
```

### Components

`route.ts`
Defines the HTTP endpoint.

`login.types.ts`
Request and response types used by the route.

`login.instance.ts`
HTTP client used to communicate with the backend authentication service.

`guards/`
Runtime validation of incoming requests.

`services/`
Application service responsible for orchestrating the login operation.

---

# Streaming Domain

```
streaming/
└── fort-minor/
```

This module interacts with the **Fort Minor streaming microservice**.

Example endpoint:

```
POST /api/streaming/fort-minor/start
```

Responsibilities:

* initiating playback
* returning stream URLs
* coordinating streaming sessions

Typical flow:

```
Client
 ↓
API route
 ↓
Fort Minor service
 ↓
Streaming microservice
```

---

# Transport Layer

```
transport/http/
```

The transport layer centralizes **HTTP-related infrastructure**.

Responsibilities:

* error normalization
* HTTP error mapping
* reusable transport guards
* shared HTTP services

### Files

`http-error.types.ts`
Defines standard HTTP error types.

`http-error.map.ts`
Maps domain errors to HTTP responses.

`guards/is-http-error.guard.ts`
Type guard used to detect HTTP-compatible errors.

`services/error-service/`
Central service responsible for constructing and formatting errors.

---

# Design Principles

This API layer follows a few important architectural rules:

### 1. Thin Controllers

Routes should remain extremely small and only coordinate services.

Bad:

```
route.ts contains business logic
```

Good:

```
route.ts → guard → service → domain call
```

---

### 2. Separation of Concerns

Each module is separated into:

* **types**
* **guards**
* **services**
* **route**

This keeps responsibilities clear and testable.

---

### 3. Domain Isolation

The BFF layer should **never directly access databases or infrastructure**.
All domain interactions must go through **domain microservices**.

---

### 4. Explicit Contracts

Every route defines explicit request/response contracts via `*.types.ts`.

This ensures the UI and services remain type-safe.

---

# Example Request Flow

Login example:

```
POST /api/auth/login
```

Execution flow:

```
route.ts
 ↓
validation guard
 ↓
login service
 ↓
identity/authentication microservice
 ↓
response returned to client
```

---

# Example Streaming Flow

Start playback:

```
POST /api/streaming/fort-minor/start
```

Execution flow:

```
Client
 ↓
Next.js API route
 ↓
Fort Minor streaming service
 ↓
returns HLS stream URL
 ↓
Client player loads the stream
```

---

# Summary

This API folder implements a **clean BFF layer** that:

* exposes UI-friendly endpoints
* isolates the frontend from domain services
* enforces consistent request validation
* centralizes HTTP error handling
* keeps domain logic inside the microservices

The goal is to maintain a **stable and minimal boundary between the UI and the domain architecture**.
