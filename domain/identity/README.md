# 🔐 Authentication Service

The Authentication service is responsible for **user authentication and token lifecycle management**.

It provides APIs for:

- user login
- user registration
- token refresh
- identity verification

---

# Responsibilities

- validating credentials
- issuing JWT access tokens
- issuing refresh tokens
- managing authentication sessions

---

# API
```bash
POST /auth/signup
POST /auth/login
POST /auth/refresh
GET /auth/me
```


---

# Architecture

The service follows **Domain-Driven Design (DDD)**.

Layers:

- interface
- application
- domain
- infra

---

# Domain

Core domain concepts:

- User
- Email
- Password
- RefreshToken

Value objects enforce domain invariants such as:

- valid email format
- password rules

---

# Infrastructure

Infrastructure adapters include:

- MongoDB persistence
- JWT token provider
- Observability via Axiom
