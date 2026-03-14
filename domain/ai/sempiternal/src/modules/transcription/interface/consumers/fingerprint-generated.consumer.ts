import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { optionalStringEnv } from '@core/infra/env/optional-env'
import { TranscribeTrackUseCase } from '@transcription/application/use-cases/transcribe-track.use-case'
import type { FingerprintGeneratedEventMap } from '@transcription/domain/events/transcription-event.map'

/// Subscribes to `track.fingerprint.generated` and triggers audio transcription.
@Injectable()
export class FingerprintGeneratedConsumer implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<FingerprintGeneratedEventMap> | null =
    null

  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly transcribeTrack: TranscribeTrackUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'sempiternal-workers')
    this.consumer = new NatsQueueConsumerAdapter<FingerprintGeneratedEventMap>(
      this.connection,
      queue
    )

    this.consumer.subscribe('track.fingerprint.generated', async (payload) => {
      await this.transcribeTrack.execute({
        eventId: `track.fingerprint.generated:${payload.trackId}`,
        trackId: payload.trackId,
        storage: payload.storage
      })
    })
  }
}
