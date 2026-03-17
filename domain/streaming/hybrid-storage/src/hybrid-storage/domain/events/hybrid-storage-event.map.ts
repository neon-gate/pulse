import type { EventMap } from '@repo/kernel'

export interface HybridStorageEventMap extends EventMap {
  'track.hls.generated': {
    trackId: string
    masterPlaylist: string
    variants: Array<{
      bitrate: number
      playlist: string
      segmentsDir: string
    }>
    generatedAt: string
  }
  'track.hls.stored': {
    trackId: string
    baseKey: string
    manifestKey: string
    storedAt: string
  }
  'track.hls.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
