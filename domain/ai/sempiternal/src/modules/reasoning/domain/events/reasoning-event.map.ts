import type { EventMap } from '@repo/event-bus'

/// Events consumed by the reasoning module (inbound).
export interface ReasoningInboundEventMap extends EventMap {
  'track.fingerprint.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
  'track.transcription.completed': {
    trackId: string
    language: string
    text: string
    segments: Array<{ start: number; end: number; text: string }>
    durationInSeconds: number
    completedAt: string
  }
}

/// Events emitted by the reasoning module (outbound).
export interface ReasoningEventMap extends EventMap {
  'track.reasoning.started': {
    trackId: string
    startedAt: string
  }
  'track.approved': {
    trackId: string
    decision: 'approved'
    reason: string
    approvedAt: string
  }
  'track.rejected': {
    trackId: string
    decision: 'rejected'
    reason: string
    rejectedAt: string
  }
  'track.reasoning.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
