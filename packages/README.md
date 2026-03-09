# 📦 Platform Packages — Shared Infrastructure & Platform Kernel

The `packages/` directory contains the **shared platform libraries** that power the entire system.

Unlike the services located in `apps/` or the domain logic inside `domain/`, these packages provide **cross-cutting infrastructure capabilities** used across the platform.

They form the **internal platform toolkit** that allows microservices to remain:

* consistent
* lightweight
* composable
* infrastructure-agnostic

These packages are the **building blocks of the platform runtime**.

---

# 🧭 Role in the Architecture

The repository follows a layered architecture:

```
Client Applications
        │
        ▼
Domain Microservices
        │
        ▼
Platform Packages
        │
        ▼
Infrastructure Systems
(Database / Cache / Message Bus / Storage)
```

The packages layer sits **between domain services and infrastructure**, providing **abstractions, adapters, and internal tooling** that simplify service development.

Without these packages, every microservice would need to directly manage:

* message brokers
* caching infrastructure
* resilience patterns
* database clients
* internal platform conventions

Instead, these concerns are centralized and standardized in this layer.

---

# 🧱 Design Philosophy

The `packages/` directory exists to enforce **platform-level consistency**.

Each package typically provides one of the following:

| Category                | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| Infrastructure adapters | Connect services to infrastructure          |
| Platform primitives     | Core building blocks shared across services |
| Resilience utilities    | Reliability and fault tolerance             |
| Runtime services        | Messaging, caching, and event handling      |
| UI system packages      | Shared design primitives                    |

These packages enable microservices to remain **focused on domain logic** instead of infrastructure complexity.

---

# 📦 Package Overview

The platform currently includes the following packages.

---

# 🧠 Kernel

```
packages/kernel
```

The **kernel** package acts as the **core foundation of the platform runtime**.

It typically contains shared primitives such as:

* base types
* platform interfaces
* internal utility abstractions
* service bootstrapping logic

The kernel establishes **common architectural conventions** that other packages and services build upon.

It effectively serves as the **lowest-level platform dependency**.

---

# 📡 Event Bus

```
packages/event-bus
```

The event bus package provides the **core event-driven messaging abstraction** used across the platform.

Instead of services directly interacting with messaging systems, they communicate through a unified **event bus interface**.

Capabilities typically include:

* publishing domain events
* subscribing to events
* message routing
* event serialization

This abstraction allows the platform to support **multiple messaging backends** without changing service code.

---

# 🚀 Event Bus NATS

```
packages/event-bus-nats
```

This package implements the **event bus interface using NATS**.

NATS is a lightweight, high-performance messaging system commonly used in microservice architectures.

Responsibilities include:

* connecting to the NATS cluster
* publishing messages
* subscribing to event streams
* handling message acknowledgements

By isolating the NATS implementation in its own package, the system maintains **clean separation between messaging abstractions and infrastructure details**.

---

# ⚡ Cache

```
packages/cache
```

The cache package defines a **generic caching abstraction** used by services throughout the platform.

Instead of tying services to a specific cache technology, the platform provides a consistent caching interface.

Typical capabilities include:

* key-value storage
* cache invalidation
* TTL management
* caching decorators

This abstraction allows caching to remain **pluggable and infrastructure-independent**.

---

# 🧊 Redis Cache Adapter

```
packages/cache-redis
```

This package provides the **Redis-backed implementation** of the platform cache interface.

Redis is commonly used for:

* low-latency caching
* session storage
* rate limiting
* distributed locks

By separating Redis integration from the cache abstraction, the system preserves **clean architectural boundaries**.

---

# 🛡 Circuit Breaker

```
packages/circuit-breaker
```

The circuit breaker package implements a **resilience pattern** designed to protect services from cascading failures.

It provides mechanisms for:

* detecting failing dependencies
* temporarily stopping calls to failing services
* allowing gradual recovery

This pattern is essential in distributed systems where downstream services may become unstable.

Typical circuit breaker states include:

```
Closed   → normal operation
Open     → calls blocked due to failures
HalfOpen → testing if the system has recovered
```

By using a shared circuit breaker implementation, the platform ensures **consistent fault-tolerance behavior across services**.

---

# 🌈 Neon Tokens

```
packages/neon
```

The **neon** package provides a **minimal set of shared color tokens** used across the platform.

Originally the repository contained a larger theme system, but the platform now relies primarily on **Tailwind design tokens defined at the application layer** (for example in the Next.js apps).

Because of that shift, the neon package intentionally remains **very small and focused**.

It exports only a limited set of **Neon color primitives** that are used for:

* surface colors
* brand accents
* shared UI highlights

These tokens allow applications to maintain **visual consistency for core platform colors** without introducing a full design system dependency.

---

## Design Approach

The styling strategy is now split into two layers:

```
Tailwind Tokens (application layer)
        ↓
Neon Tokens (shared primitives)
```

Applications define most UI styling through **Tailwind configuration**, while the neon package provides a **stable shared color reference** for key platform surfaces.

This keeps the platform:

* lightweight
* flexible for UI development
* free from unnecessary design system complexity
---

# 🔄 How Services Use Platform Packages

Microservices consume these packages as **internal platform dependencies**.

Example:

```
Streaming Service
        │
        ├─ event-bus
        ├─ cache
        ├─ circuit-breaker
        └─ kernel
```

This model ensures that services:

* do not reinvent infrastructure logic
* share common reliability patterns
* remain lightweight and maintainable

---

# ⚙️ Monorepo Integration

All packages are managed inside the **Turborepo monorepo**.

Benefits include:

* shared dependency graph
* incremental builds
* build caching
* consistent versioning

When running:

```
pnpm build
```

Turborepo determines the correct **package build order** based on dependency relationships.

This ensures that dependent packages compile in the correct sequence.

---

# 🧩 Platform Architecture Vision

The `packages/` directory represents the **internal platform layer**.

In mature distributed systems, engineering organizations often evolve toward **internal developer platforms (IDPs)** that provide reusable building blocks for services.

This layer moves the repository toward that vision by providing:

* infrastructure abstractions
* reliability patterns
* standardized integrations
* shared platform primitives

Over time, additional platform capabilities may appear here, such as:

* observability tooling
* service discovery
* configuration management
* feature flags
* distributed tracing

---

# 🚀 Summary

The `packages/` directory contains the **shared platform runtime that powers the system's microservices**.

These packages provide:

* infrastructure adapters
* resilience primitives
* messaging abstractions
* caching systems
* shared design primitives

By centralizing these concerns, the platform enables services to focus on **business logic and domain behavior**, while the underlying platform layer handles the complexity of distributed systems infrastructure.

This separation is key to maintaining a **scalable, maintainable, and production-grade architecture**.
