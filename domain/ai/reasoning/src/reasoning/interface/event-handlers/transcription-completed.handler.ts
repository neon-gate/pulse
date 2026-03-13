import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import {
  AggregateTranscriptionSignalUseCase,
  RunReasoningUseCase
} from '@application/use-cases'
import type { ReasoningInboundEventMap } from '@domain/events'
import { NatsConnectionToken } from '@infra/event-bus'
import { optionalStringEnv } from '@infra/env'

/// Subscribes to `track.transcription.completed`. Stores the transcription
/// signal and checks if reasoning can now start.
@Injectable()
export class TranscriptionCompletedHandler implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateTranscription: AggregateTranscriptionSignalUseCase,
    private readonly runReasoning: RunReasoningUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'reasoning-workers')
    const consumer = new NatsQueueConsumerAdapter<ReasoningInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe('track.transcription.completed', async (payload) => {
      await this.aggregateTranscription.execute({
        trackId: payload.trackId,
        text: payload.text,
        language: payload.language,
        durationInSeconds: payload.durationInSeconds
      })

      await this.runReasoning.execute({
        eventId: `reasoning:transcription:${payload.trackId}`,
        trackId: payload.trackId
      })
    })
  }
}
