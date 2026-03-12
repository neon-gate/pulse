import { Event } from '@repo/kernel'

export interface TranscodeCompletedPayload {
  trackId: string
  outputDir: string
  occurredAt: string
}

export class TranscodeCompletedEvent extends Event<TranscodeCompletedPayload> {
  get eventName() {
    return 'streaming.mocking-bird.transcode.completed'
  }

  get eventVersion() {
    return 1
  }
}
