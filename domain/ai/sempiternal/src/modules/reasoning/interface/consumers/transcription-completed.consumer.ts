import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { optionalStringEnv } from '@core/infra/env/optional-env'
import { AggregateTranscriptionSignalUseCase } from '@reasoning/application/use-cases/aggregate-transcription-signal.use-case'
import { RunReasoningUseCase } from '@reasoning/application/use-cases/run-reasoning.use-case'
import type { ReasoningInboundEventMap } from '@reasoning/domain/events/reasoning-event.map'

/// Subscribes to `track.transcription.completed`, stores the transcription
/// signal, and checks if reasoning can now start.
@Injectable()
export class TranscriptionCompletedConsumer implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateTranscription: AggregateTranscriptionSignalUseCase,
    private readonly runReasoning: RunReasoningUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'sempiternal-workers')
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
