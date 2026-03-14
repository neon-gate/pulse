import type { EventMap } from '@repo/event-bus'

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
  'track.upload.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
