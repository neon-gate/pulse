import type { EventMap } from '@repo/event-bus'

export type FortMinorEventMap = EventMap & {
  'streaming.fort-minor.stream.started': {
    trackId: string
    playlistPath: string
    occurredAt: string
  }
  'streaming.fort-minor.transcode.completed': {
    trackId: string
    outputDir: string
    occurredAt: string
  }
}
