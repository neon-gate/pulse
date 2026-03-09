# 🎧 HLS Streaming Layer — Player Runtime

This folder contains the **runtime streaming layer for the Pulse audio player**.

It is responsible for attaching **HLS streams to the browser audio element** and synchronizing playback with the **global player state managed through Jotai atoms**.

Unlike a traditional component-driven player where state is passed down through props, Pulse uses **fine-grained global state atoms**. These atoms behave like **control wires that coordinate independent components**, allowing the player UI to react to playback changes without tight coupling.

---

# Purpose

The `hls` module acts as the **streaming engine of the player**.

Responsibilities:

* attaching **HLS streams** to the audio element
* reacting to **track changes**
* syncing playback with global state
* enabling **system media controls**
* isolating streaming protocol logic from the UI

This allows the UI components to focus purely on **presentation and interaction** while playback behavior remains centralized.

---

# Streaming Technology

Audio playback uses **HLS (HTTP Live Streaming)**.

Instead of loading a full audio file, the player streams **small segmented chunks**.

Typical flow:

```
User selects track
↓
currentTrackAtom updates
↓
Hls component loads stream
↓
hls.js requests master playlist
↓
audio segments stream progressively
```

This approach enables:

* progressive playback
* resilient buffering
* scalable streaming infrastructure

---

# Core Component

File:

```
lib/hls/hls.tsx
```

The `Hls` component is the **player engine**.

It:

* reads the currently active track
* loads the stream
* attaches Media Session controls
* renders the hidden `<audio>` element

Example implementation:

```
export function Hls() {
  const [track] = useImmerAtom(currentTrackAtom)

  const { audioRef } = useHlsLoader(track.src)

  useMediaSession({
    track,
    audioRef,
  })

  return (
    <audio
      ref={audioRef}
      className="invisible"
      controls
    />
  )
}
```

The `<audio>` element is **invisible** because UI playback controls are implemented elsewhere in the player interface.

---

# Hooks

## `useHlsLoader`

Responsible for:

* initializing **hls.js**
* attaching the HLS stream to the audio element
* updating the source when the track changes

Responsibilities include:

* creating the HLS instance
* binding it to the audio element
* loading the stream URL

---

## `useMediaSession`

Integrates the **Media Session API**.

This allows the browser or operating system to control playback via:

* lockscreen controls
* keyboard media keys
* system media widgets
* headset controls

The metadata passed here powers the **system-level media interface**.

---

# Fine-Grained State Management

Pulse uses **Jotai atoms** for global player state.

Instead of lifting state through React component trees, **atoms behave like independent reactive state nodes**.

Key atoms used by the player include:

```
currentTrackAtom
progressAtom
isPausedAtom
volumeAtom
```

Each atom represents a **small piece of state**.

This design enables **fine-grained updates**, meaning:

* only components that depend on a specific atom re-render
* player UI remains decoupled from the streaming engine
* components can subscribe to only the data they need

---

# The "Marionette Strings" Model

Atoms act like **control wires between independent components**.

For example:

```
Track selection component
      │
      │ updates
      ▼
currentTrackAtom
      │
      │ triggers
      ▼
Hls component loads new stream
```

The `Hls` component does **not need props** like:

```
<Hls track={track} />
```

Instead, it directly reads from:

```
currentTrackAtom
```

This creates a **loosely coupled reactive system** where:

* components publish state updates
* other components react automatically

Like **marionette strings connecting the player parts together**.

---

# Example Usage in the Player

The streaming engine is mounted inside the player UI:

```
<ProgressBar>
  ...
  <Hls />
</ProgressBar>
```

The progress bar reads state from:

```
progressAtom
currentTrackAtom
```

and updates playback progress independently of the streaming logic.

Example flow:

```
HLS audio plays
↓
Progress atom updates
↓
Progress bar re-renders
```

The UI remains synchronized with playback without direct component coupling.

---

# Why This Architecture Works Well

Advantages:

* **fine-grained reactivity**
* **minimal prop drilling**
* **separation of playback and UI**
* **independent player components**
* **clean streaming abstraction**

This design allows the Pulse player to scale easily as additional features are added such as:

* queue management
* playback controls
* waveform visualization
* playlist transitions

---

# Summary

The `hls` module acts as the **core streaming runtime for Pulse**.

It:

* loads and controls HLS audio streams
* synchronizes playback with global state atoms
* integrates system media controls
* keeps streaming logic isolated from UI components

By combining **HLS streaming, Media Session API, and fine-grained atom state**, the player architecture remains **modular, reactive, and easy to extend**.
