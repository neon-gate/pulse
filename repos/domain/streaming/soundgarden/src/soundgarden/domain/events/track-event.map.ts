import type { EventMap } from '@repo/kernel'

export interface TrackEventMap extends EventMap {
  'track.upload.received': {
    trackId: string
    fileName: string
    receivedAt: string
  }
  'track.upload.validated': {
    trackId: string
    fileName: string
    fileSize: number
    mimeType: string
    validatedAt: string
  }
  'track.upload.stored': {
    trackId: string
    filePath: string
    fileName: string
    fileSize: number
    storedAt: string
  }
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
  'track.upload.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
