import type { EventMap } from '@pack/kernel'

import { TrackEvent } from '@env/event-inventory'
export interface MockingbirdEventMap extends EventMap {
  [TrackEvent.Approved]: {
    trackId: string
    objectKey: string
    sourceStorage: {
      bucket: string
      key: string
    }
    decision: 'approved'
    reason: string
    approvedAt: string
  }
  [TrackEvent.TranscodingStarted]: {
    trackId: string
  }
  [TrackEvent.TranscodingCompleted]: {
    trackId: string
    variants: Array<{
      bitrate: number
      bucket: string
      key: string
    }>
    completedAt: string
  }
  [TrackEvent.HlsGenerated]: {
    trackId: string
    masterPlaylist: string
    variants: Array<{
      bitrate: number
      playlist: string
      segmentsDir: string
    }>
    generatedAt: string
  }
  [TrackEvent.TranscodingFailed]: {
    trackId: string
    errorCode: string
    message: string
  }
}
