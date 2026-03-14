import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { GenerateFingerprintUseCase } from '@application/use-cases'
import type { TrackUploadedEventMap } from '@domain/events'
import { NatsConnectionToken } from '@infra/event-bus'
import { optionalStringEnv } from '@infra/env'

/// Subscribes to `track.uploaded` using a queue group and delegates
/// processing to GenerateFingerprintUseCase.
@Injectable()
export class TrackUploadedHandler implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<TrackUploadedEventMap> | null =
    null

  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly generateFingerprint: GenerateFingerprintUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'fingerprint-workers')
    this.consumer = new NatsQueueConsumerAdapter<TrackUploadedEventMap>(
      this.connection,
      queue
    )

    this.consumer.subscribe('track.uploaded', async (payload) => {
      // Skip if downstream storage refs are absent (local bring-up mode).
      if (!payload.storage || !payload.transcriptionStorage) return

      await this.generateFingerprint.execute({
        eventId: `track.uploaded:${payload.trackId}`,
        trackId: payload.trackId,
        storage: payload.storage,
        transcriptionStorage: payload.transcriptionStorage
      })
    })
  }
}
