import type { EventMap } from '@pack/kernel'

import { TrackEvent } from '@env/event-inventory'
/// Events consumed by the petrified module (inbound).
export interface TrackUploadedEventMap extends EventMap {
  [TrackEvent.Uploaded]: {
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
  [TrackEvent.PetrifiedGenerated]: {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
  [TrackEvent.PetrifiedSongUnknown]: {
    trackId: string
    audioHash: string
    detectedAt: string
  }
  [TrackEvent.PetrifiedDetected]: {
    trackId: string
    originalTrackId: string
    audioHash: string
    detectedAt: string
  }
  [TrackEvent.PetrifiedFailed]: {
    trackId: string
    errorCode: string
    message: string
  }
  [TrackEvent.DuplicateDetected]: {
    trackId: string
    originalTrackId: string
    audioHash: string
    detectedAt: string
  }
}
