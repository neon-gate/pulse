import type { EventMap } from '@repo/kernel'

/// Events consumed by the stereo module (inbound).
export interface StereoInboundEventMap extends EventMap {
  'track.petrified.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
  'track.fort-minor.completed': {
    trackId: string
    language: string
    text: string
    segments: Array<{ start: number; end: number; text: string }>
    durationInSeconds: number
    completedAt: string
  }
}

/// Events emitted by the stereo module (outbound).
export interface StereoEventMap extends EventMap {
  'track.stereo.started': {
    trackId: string
    startedAt: string
  }
  'track.approved': {
    trackId: string
    sourceStorage: {
      bucket: string
      key: string
    }
    objectKey: string
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
  'track.stereo.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
