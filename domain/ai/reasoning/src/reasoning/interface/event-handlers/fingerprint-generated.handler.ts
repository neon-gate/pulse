import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import {
  AggregateFingerprintSignalUseCase,
  RunReasoningUseCase
} from '@application/use-cases'
import type { ReasoningInboundEventMap } from '@domain/events'
import { NatsConnectionToken } from '@infra/event-bus'
import { optionalStringEnv } from '@infra/env'

/// Subscribes to `track.fingerprint.generated`. Stores the fingerprint signal
/// and checks if reasoning can now start (both signals present).
@Injectable()
export class FingerprintGeneratedHandler implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateFingerprint: AggregateFingerprintSignalUseCase,
    private readonly runReasoning: RunReasoningUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnv('NATS_QUEUE_GROUP', 'reasoning-workers')
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
