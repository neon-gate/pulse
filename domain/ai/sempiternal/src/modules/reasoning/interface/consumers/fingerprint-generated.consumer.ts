import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { optionalStringEnv } from '@core/infra/env/optional-env'
import { AggregateFingerprintSignalUseCase } from '@reasoning/application/use-cases/aggregate-fingerprint-signal.use-case'
import { RunReasoningUseCase } from '@reasoning/application/use-cases/run-reasoning.use-case'
import type { ReasoningInboundEventMap } from '@reasoning/domain/events/reasoning-event.map'

/// Subscribes to `track.fingerprint.generated`, stores the fingerprint signal,
/// and checks if reasoning can now start.
@Injectable()
export class FingerprintGeneratedConsumer implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateFingerprint: AggregateFingerprintSignalUseCase,
    private readonly runReasoning: RunReasoningUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'sempiternal-workers')
    const consumer = new NatsQueueConsumerAdapter<ReasoningInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe('track.fingerprint.generated', async (payload) => {
      await this.aggregateFingerprint.execute({
        trackId: payload.trackId,
        fingerprintHash: payload.fingerprintHash,
        audioHash: payload.audioHash
      })

      await this.runReasoning.execute({
        eventId: `reasoning:fingerprint:${payload.trackId}`,
        trackId: payload.trackId
      })
    })
  }
}
