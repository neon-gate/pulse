import type { EventMap } from '@repo/kernel'

/// Events consumed by the fort-minor module (inbound).
export interface PetrifiedGeneratedEventMap extends EventMap {
  'track.petrified.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
}

/// Events emitted by the fort-minor module (outbound).
export interface FortMinorEventMap extends EventMap {
  'track.fort-minor.started': {
    trackId: string
    startedAt: string
  }
  'track.fort-minor.completed': {
    trackId: string
    language: string
    text: string
    segments: Array<{ start: number; end: number; text: string }>
    durationInSeconds: number
    completedAt: string
  }
  'track.fort-minor.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
