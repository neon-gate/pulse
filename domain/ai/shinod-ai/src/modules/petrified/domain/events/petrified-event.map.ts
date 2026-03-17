import type { EventMap } from '@repo/kernel'

/// Events consumed by the petrified module (inbound).
export interface TrackUploadedEventMap extends EventMap {
  'track.uploaded': {
    trackId: string
    filePath: string
    fileName: string
    fileSize: number
    mimeType: string
    soundgardenStorage?: {
      bucket: string
      key: string
    }
    sourceStorage: {
      bucket: string
      key: string
    }
    petrifiedStorage: {
      bucket: string
      key: string
    }
    fortMinorStorage: {
      bucket: string
      key: string
    }
    /** @deprecated Use petrifiedStorage */
    storage?: {
      bucket: string
      key: string
    }
    /** @deprecated Use fortMinorStorage */
    transcriptionStorage?: {
      bucket: string
      key: string
    }
    uploadedAt: string
  }
}

/// Events emitted by the petrified module (outbound).
export interface PetrifiedEventMap extends EventMap {
  'track.petrified.generated': {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
  'track.petrified.song.unknown': {
    trackId: string
    audioHash: string
    detectedAt: string
  }
  'track.petrified.detected': {
    trackId: string
    originalTrackId: string
    audioHash: string
    detectedAt: string
  }
  'track.petrified.failed': {
    trackId: string
    errorCode: string
    message: string
  }
  'track.duplicate.detected': {
    trackId: string
    originalTrackId: string
    audioHash: string
    detectedAt: string
  }
}
