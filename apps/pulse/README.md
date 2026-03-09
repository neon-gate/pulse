# 🎧 Neon Streaming Frontend

**Next.js Spotify-like Interface (Monorepo App)**

This project is the frontend application of a distributed music streaming platform built as an architecture experiment and learning project.

The goal is to explore how modern streaming platforms like Spotify structure their interfaces and playback layers while maintaining:

- smooth streaming playback
- resilient UI state
- fine-grained interactivity
- modular architecture
- scalable code organization

The application lives inside a monorepo and communicates with backend microservices responsible for authentication, metadata, streaming, and storage.

The frontend focuses on three main challenges:

1. **Streaming playback experience**
2. **Highly interactive UI**
3. **Fine-grained state orchestration**

## 🧠 Philosophy

The frontend architecture is based on three principles:

| Principle | Description |
|-----------|-------------|
| Granularity | UI broken into independent pieces that update independently |
| Streaming-friendly UI | Interface designed around asynchronous streaming events |
| Fine-grained state | State slices control tiny UI fragments |

This approach mirrors the architecture of real music platforms where UI elements react independently to playback state.

**Example:**

- progress bar updates every second
- metadata updates only when the track changes
- volume slider updates independently
- library list updates only when data changes

## 🏗 Monorepo Context

The frontend lives inside a monorepo organized with Turborepo.

```
repo
├─ apps
│  ├─ web        # Next.js frontend
│  └─ api        # backend gateway
│
├─ packages
│  ├─ neon       # design system utilities
│  └─ shared
│
└─ turbo.json
```

**Benefits of this structure:**

| Benefit | Explanation |
|---------|-------------|
| Shared packages | design system + utilities reused |
| Independent apps | frontend and backend evolve separately |
| Fast builds | Turborepo caching |
| Clear boundaries | microservice oriented |

## ⚡ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js |
| UI | React |
| Styling | TailwindCSS |
| Components | shadcn/ui |
| Icons | Lucide |
| State | Jotai + Jotai Immer |
| Validation | Zod |
| Streaming | hls.js |
| Networking | Axios |
| Utilities | clsx |
| AI utilities | AI SDK React |
| Language | TypeScript |

### Why These Technologies

#### Next.js

Next.js was chosen for its modern React architecture and server features.

Key capabilities used:

- App Router
- Server Components
- Server Actions
- Parallel Routes
- Route Slots

These allow the UI to behave like independent micro frontends within a single app.

#### React

React provides:

- composable UI
- component isolation
- predictable rendering

This pairs extremely well with fine-grained state management.

#### TailwindCSS

Tailwind provides utility-first styling.

**Benefits:**

- consistent spacing
- predictable design tokens
- minimal CSS bloat
- easy theming

#### shadcn/ui

shadcn is used as a component foundation, but heavily customized.

The design system overrides create a SynthWave / Neon aesthetic.

Example surfaces:

- neon gradients
- glass surfaces
- glowing borders

These are implemented through utilities from the internal `@repo/neon` package.

#### Jotai + Immer

The application uses atomic state management.

This means state is split into small independent atoms instead of a single global store.

**Benefits:**

| Advantage | Explanation |
|-----------|-------------|
| Minimal re-renders | only affected components update |
| Granular state | small UI pieces controlled individually |
| Predictable state | atoms are isolated |
| Easy composition | atoms can derive other atoms |

Immer adds immutable state ergonomics.

## 🎛 Fine-Grained State Model

The UI behaves like a marionette controlled by atomic state slices.

```
          ┌─────────────┐
          │  Jotai Atoms │
          └──────┬──────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
  Volume     Playback     Metadata
      │          │          │
  Slider UI   Progress   Track Info
```

Each UI component subscribes only to the atoms it needs.

**Example:**

| Component | Atom |
|-----------|------|
| Volume slider | volumeAtom |
| Progress bar | progressAtom |
| Track metadata | currentTrackAtom |

## 🧩 App Router Architecture

The UI uses Next.js Parallel Routes and Slots to fragment the interface.

```
app
│
├─ (public)
│   └─ (auth)
│       ├─ login
│       └─ signup
│
└─ (player)
    ├─ @library
    ├─ @nowPlaying
    ├─ @uploader
    └─ @userMenu
```

Parallel routes allow independent UI areas to render simultaneously.

## 🎵 Player Layout Slots

The player UI is divided into independent slots.

```
Player Layout
│
├─ Library
│   └─ music browsing
│
├─ Now Playing
│   ├─ streaming controls
│   ├─ track metadata
│   └─ volume slider
│
├─ Uploader
│
└─ User Menu
```

This structure allows each section to render and update independently.

## 🎚 Now Playing Slot

The Now Playing bar behaves like Spotify's bottom player.

```
┌────────────────────────────────────┐
│ Track Metadata | Controls | Volume │
└────────────────────────────────────┘
```

Internally it is broken into smaller slots:

```
NowPlaying
│
├─ StreamingControls
│   ├─ progress bar
│   ├─ play/pause
│   └─ seek
│
├─ TrackMetadata
│
└─ VolumeSlider
```

Each piece subscribes only to its relevant atoms.

## 📦 Project Structure

```
app
 ├─ api
 ├─ (public)
 └─ (player)

lib
 ├─ atoms
 ├─ domain
 ├─ hls
 ├─ media-session
 ├─ state
 ├─ templates
 ├─ ui
 └─ validation

infra
 └─ shared components
```

## 📚 Domain Definitions

Domain files define UI domain models.

**Examples:**

- album.domain.ts
- artist.domain.ts
- avatar.domain.ts
- currentTrack.domain.ts
- galleryTrack.domain.ts
- progress.domain.ts
- session.domain.ts
- user.domain.ts
- volume.domain.ts

These serve as typed contracts for UI state.

## 🧠 Atom Layer

Atoms represent UI state slices.

**Examples:**

| Atom | Description |
|------|-------------|
| currentTrackAtom | metadata of current song |
| galleryAtom | list of tracks |
| progressAtom | playback time |
| volumeAtom | player volume |
| userAtom | authenticated user |
| isPausedAtom | playback state |

This granularity allows extremely precise UI updates.

## 🎚 Example: Volume Control

One interesting example of fine-grained state is the volume slider logic.

Instead of manually mapping icons, the system computes the closest volume category.

**Example algorithm:**

```ts
export function getClosestIconVolume(value: number): Volume {
  const volumes = Object.values(Volume) as Volume[]

  return volumes.reduce((closest, current) => {
    const currentDistance = Math.abs(Number(current) - value)
    const closestDistance = Math.abs(Number(closest) - value)

    return currentDistance < closestDistance ? current : closest
  })
}
```

Then we map icons dynamically.

| Volume | Icon |
|--------|------|
| Off | 🔇 |
| Quiet | 🔈 |
| Moderate | 🔉 |
| Loud | 🔊 |

This approach keeps UI logic:

- declarative
- extensible
- easy to test

## 🎧 Streaming Layer

Streaming uses HTTP Live Streaming (HLS).

**Player:** hls.js

HLS allows:

- segmented streaming
- adaptive playback
- buffering resilience

## 📱 Media Session API

The app integrates the Media Session API.

This allows interaction with system controls.

**Examples:**

- lock screen playback
- hardware play/pause buttons
- OS media center
- headphone controls

## 🧩 API Layer

The frontend contains API routes for gateway interactions.

**Structure:**

```
api
├─ auth
├─ streaming
└─ start
```

Each module contains:

- guards
- services
- routes

Validation is handled using Zod.

## 🔐 Auth Module

Handles login and session validation.

Includes:

- route handlers
- request guards
- service abstractions

Services are injected using inversion of control patterns.

## 🌐 Transport Layer

Shared HTTP abstractions live in:

```
api/shared/transport
```

This layer provides:

- guards
- request types
- service utilities

Used by all API modules.

## 🎨 Design System

The UI aesthetic is SynthWave-inspired.

**Custom utilities include:**

- neon surfaces
- gradient glass backgrounds
- glowing accents

Implemented through:

- `@repo/neon`

**Example surfaces:**

- surface-neon
- surface-glass
- bg-neon-cool

## 🧪 Testing Utilities

The project includes:

- lib/mocks

Used for:

- UI testing
- state simulation
- API mocking

## 📊 Architectural Overview

```
Frontend App
│
├─ UI Layer
│   ├─ slots
│   ├─ components
│   └─ layouts
│
├─ State Layer
│   ├─ atoms
│   └─ domains
│
├─ Streaming Layer
│   ├─ hls
│   └─ media session
│
├─ API Layer
│   ├─ auth
│   ├─ streaming
│   └─ start
│
└─ Utilities
    ├─ validation
    ├─ templates
    └─ formatting
```

## 🚀 Future Plans

Planned features include:

- track uploads
- metadata AI enrichment
- playlist management
- streaming analytics
- offline playback

## 🎯 Final Thoughts

This frontend explores how modern music platforms combine:

- streaming protocols
- atomic state management
- granular UI architectures

By combining Next.js parallel routing, Jotai atoms, and HLS streaming, the project simulates many behaviors seen in production streaming platforms.

The result is a frontend architecture that is:

- **highly modular**
- **reactive to streaming events**
- **scalable for complex interfaces**
