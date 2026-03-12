import { Event } from '@repo/kernel'

export interface StreamStartedPayload {
  trackId: string
  playlistPath: string
  occurredAt: string
}

export class StreamStartedEvent extends Event<StreamStartedPayload> {
  get eventName() {
    return 'streaming.mocking-bird.stream.started'
  }

  get eventVersion() {
    return 1
  }
}
