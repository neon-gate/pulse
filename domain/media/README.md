# Media Bounded Context

The **Media bounded context** is responsible for managing all domain concepts related to audio content, including tracks, metadata, playback, and backstage operations.

This bounded context is composed of multiple microservices, each responsible for a specific domain capability.

---

# Microservices

## Fort Minor

**Role**

Fort Minor acts as the orchestration service for workflows involving multiple media services.

**Responsibilities**

* Coordinate multi-service workflows
* Orchestrate track publishing
* Manage complex domain processes involving Tracks, Metadata, Playback, and Backstage
* Handle saga-style workflows if required

**Key Interactions**

* Tracks
* Metadata
* Playback
* Backstage

---

## Tracks

**Role**

The Tracks service is responsible for managing the lifecycle of audio tracks.

**Responsibilities**

* Create and manage tracks
* Track status management (draft, published, archived)
* Track ownership and identification
* Maintain track-level domain rules

**Owned Data**

* Track ID
* Track lifecycle state
* Track relationships

---

## Metadata

**Role**

The Metadata service manages descriptive information associated with tracks.

**Responsibilities**

* Store and manage track metadata
* Manage artists, genres, and descriptive fields
* Provide metadata retrieval APIs
* Maintain metadata integrity

**Owned Data**

* Track metadata
* Artist references
* Genre information
* Descriptive attributes

---

## Playback

**Role**

The Playback service is responsible for preparing and delivering tracks for playback.

**Responsibilities**

* Handle playback preparation
* Manage streaming endpoints
* Provide playback tokens or URLs
* Track playback state if required

**Owned Data**

* Playback sessions
* Stream references
* Playback configurations

---

## Backstage

**Role**

Backstage provides operational and administrative functionality related to media management.

**Responsibilities**

* Administrative workflows
* Internal operational tooling
* Moderation or review processes
* Operational management of tracks and assets

**Owned Data**

* Operational records
* Administrative state
* Review or moderation status

---

# Service Interaction Model

Services communicate through:

* APIs
* Events
* Orchestration via **Fort Minor**

Direct service-to-service communication should be minimized where orchestration workflows exist.

---

# Design Principles

* Each service owns its data
* Domain logic remains within domain services
* Orchestration logic belongs in Fort Minor
* Loose coupling between services
