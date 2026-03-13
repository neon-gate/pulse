import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { TranscribeTrackUseCase } from '@application/use-cases'
import type { FingerprintGeneratedEventMap } from '@domain/events'
import { NatsConnectionToken } from '@infra/event-bus'
import { optionalStringEnv } from '@infra/env'

@Injectable()
export class FingerprintGeneratedHandler implements OnApplicationBootstrap {
  private consumer: NatsQueueConsumerAdapter<FingerprintGeneratedEventMap> | null = null

  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly transcribeTrack: TranscribeTrackUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'transcription-workers')
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
