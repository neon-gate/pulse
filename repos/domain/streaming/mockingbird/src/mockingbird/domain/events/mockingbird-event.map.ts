import type { EventMap } from '@repo/kernel'

export interface MockingbirdEventMap extends EventMap {
  'track.approved': {
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
  'track.transcoding.started': {
    trackId: string
  }
  'track.transcoding.completed': {
    trackId: string
    variants: Array<{
      bitrate: number
      bucket: string
      key: string
    }>
    completedAt: string
  }
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
  'track.transcoding.failed': {
    trackId: string
    errorCode: string
    message: string
  }
}
