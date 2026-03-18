import type { EventMap } from '@pack/kernel'

import { TrackEvent } from '@env/event-inventory'
export interface HybridStorageEventMap extends EventMap {
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
  [TrackEvent.HlsStored]: {
    trackId: string
    baseKey: string
    manifestKey: string
    storedAt: string
  }
  [TrackEvent.HlsFailed]: {
    trackId: string
    errorCode: string
    message: string
  }
}
