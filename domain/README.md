# 🧠 Domain Layer

The **Domain layer** contains the core backend services of the platform, organized by **Bounded Contexts** following Domain-Driven Design (DDD) principles.

Each bounded context represents a **distinct business capability** and contains one or more **independent microservices** responsible for specific parts of the domain.

```
domain/
├── identity/
├── media/
└── streaming/
```

---

# 🧩 Bounded Contexts

## 🔐 Identity

Responsible for **authentication, identity management, and user-related concerns**.

Services in this context handle:

* authentication flows
* identity lifecycle
* user account management
* identity federation

📁 Location:

```
domain/identity/
```

---

## 🎵 Media

Responsible for the **content lifecycle of audio media**.

This context manages:

* track ingestion
* media processing
* metadata
* storage
* media preparation for streaming

📁 Location:

```
domain/media/
```

---

## 📡 Streaming

Responsible for **delivering media to clients**.

This context manages:

* playback sessions
* streaming authorization
* delivery infrastructure
* streaming protocols

📁 Location:

```
domain/streaming/
```

---

# ⚙️ Design Principles

The domain layer follows a few important architectural principles:

### 🧭 Bounded Context Isolation

Each context owns its **domain models, services, and logic**. Cross-context communication should happen via:

* APIs
* events
* message buses

---

### 🧩 Microservice Ownership

Each service is responsible for **a single business capability** and owns its own data and internal logic.

---

### 📦 Runtime Independence

Services inside the domain layer run **independently at runtime** and communicate through well-defined interfaces.

---

# 🚀 Development

Each service inside a bounded context is a **separate workspace** managed by the monorepo tooling.

Common commands:

```bash
pnpm turbo run dev
pnpm turbo run build
pnpm turbo run test
```

---

# 📚 Related Folders

| Folder               | Purpose                                 |
| -------------------- | --------------------------------------- |
| `apps/`              | Frontend applications                   |
| `packages/`          | Shared libraries and platform utilities |
| `bin/`               | Development scripts                     |
| `docker-compose.yml` | Local development infrastructure        |
|                      |                                         |

---

# ✨ Summary

The **Domain layer** is the heart of the platform, where the business capabilities are implemented.

By structuring services into bounded contexts, the system stays:

* scalable
* modular
* easier to reason about
* aligned with the business domain
