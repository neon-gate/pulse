import type { EventMap } from '@repo/kernel'

export interface MockingbirdEventMap extends EventMap {
  'track.approved': {
    trackId: string
    objectKey: string
  }
  'track.transcoding.started': {
    trackId: string
  }
  'track.transcoding.completed': {
    trackId: string
    variants: string[]
  }
  'track.hls.generated': {
    trackId: string
    masterPlaylist: string
    variants: Array<{
      bitrate: number
      playlist: string
      segmentsDir: string
    }>
  }
  'track.transcoding.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
