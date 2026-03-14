import type { EventMap } from '@repo/event-bus'

/// Events consumed by the fingerprint module (inbound).
export interface TrackUploadedEventMap extends EventMap {
  'track.uploaded': {
    trackId: string
    filePath: string
    fileName: string
    fileSize: number
    mimeType: string
    storage?: {
      bucket: string
      key: string
    }
    transcriptionStorage?: {
      bucket: string
      key: string
    }
    uploadedAt: string
  }
}

/// Events emitted by the fingerprint module (outbound).
export interface FingerprintEventMap extends EventMap {
  'track.fingerprint.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
  'track.song.unknown': {
    trackId: string
    audioHash: string
    detectedAt: string
  }
  'track.duplicate.detected': {
    trackId: string
    originalTrackId: string
    audioHash: string
    detectedAt: string
  }
  'track.fingerprint.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
