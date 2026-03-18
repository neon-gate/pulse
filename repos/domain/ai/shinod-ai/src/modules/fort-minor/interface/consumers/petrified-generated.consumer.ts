import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@pack/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@pack/event-bus'
import { optionalStringEnv } from '@env/lib'
import { TranscribeTrackUseCase } from '@fort-minor/application/use-cases/transcribe-track.use-case'
import type { PetrifiedGeneratedEventMap } from '@fort-minor/domain/events/fort-minor-event.map'

import { TrackEvent } from '@env/event-inventory'
/// Subscribes to `track.petrified.generated` and triggers audio transcription.
@Injectable()
export class PetrifiedGeneratedConsumer implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<PetrifiedGeneratedEventMap> | null =
    null

  @Inject(NatsConnectionToken)
  private readonly connection!: NatsConnection | null

  constructor(private readonly transcribeTrack: TranscribeTrackUseCase) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queueBase = optionalStringEnv(
      'NATS_QUEUE_GROUP',
      'shinod-ai-workers'
    )
    const queue = `${queueBase}-fort-minor-petrified`
    this.consumer = new NatsQueueConsumerAdapter<PetrifiedGeneratedEventMap>(
      this.connection,
      queue
    )

    this.consumer.subscribe(TrackEvent.PetrifiedGenerated, async (payload) => {
      await this.transcribeTrack.execute({
        eventId: `track.petrified.generated:${payload.trackId}`,
        trackId: payload.trackId,
        storage: payload.storage
      })
    })
  }
}
