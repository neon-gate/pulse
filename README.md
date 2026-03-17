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
