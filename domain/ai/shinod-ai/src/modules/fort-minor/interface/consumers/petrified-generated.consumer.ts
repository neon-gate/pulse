import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@repo/event-bus'
import { optionalStringEnvCompute } from '@repo/environment'
import { TranscribeTrackUseCase } from '@fort-minor/application/use-cases/transcribe-track.use-case'
import type { PetrifiedGeneratedEventMap } from '@fort-minor/domain/events/fort-minor-event.map'

/// Subscribes to `track.petrified.generated` and triggers audio transcription.
@Injectable()
export class PetrifiedGeneratedConsumer implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<PetrifiedGeneratedEventMap> | null =
    null

  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly transcribeTrack: TranscribeTrackUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnvCompute('NATS_QUEUE_GROUP', 'shinod-ai-workers')
    this.consumer = new NatsQueueConsumerAdapter<PetrifiedGeneratedEventMap>(
      this.connection,
      queue
    )

    this.consumer.subscribe('track.petrified.generated', async (payload) => {
      await this.transcribeTrack.execute({
        eventId: `track.petrified.generated:${payload.trackId}`,
        trackId: payload.trackId,
        storage: payload.storage
      })
    })
  }
}
