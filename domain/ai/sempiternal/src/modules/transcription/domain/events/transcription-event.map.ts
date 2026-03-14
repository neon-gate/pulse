import type { EventMap } from '@repo/event-bus'

/// Events consumed by the transcription module (inbound).
export interface FingerprintGeneratedEventMap extends EventMap {
  'track.fingerprint.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
}

/// Events emitted by the transcription module (outbound).
export interface TranscriptionEventMap extends EventMap {
  'track.transcription.started': {
    trackId: string
    startedAt: string
  }
  'track.transcription.completed': {
    trackId: string
    language: string
    text: string
    segments: Array<{ start: number; end: number; text: string }>
    durationInSeconds: number
    completedAt: string
  }
  'track.transcription.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
