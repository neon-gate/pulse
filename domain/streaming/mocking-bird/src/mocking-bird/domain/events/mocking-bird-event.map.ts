import type { EventMap } from '@repo/event-bus'

export interface MockingbirdEventMap extends EventMap {
  'streaming.mocking-bird.stream.started': {
    trackId: string
    playlistPath: string
    occurredAt: string
  }
  'streaming.mocking-bird.transcode.completed': {
    trackId: string
    outputDir: string
    occurredAt: string
  }
}
