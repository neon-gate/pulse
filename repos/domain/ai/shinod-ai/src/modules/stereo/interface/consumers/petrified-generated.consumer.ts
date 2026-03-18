import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@pack/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@pack/event-bus'
import { optionalStringEnv } from '@env/lib'
import { AggregateFingerprintSignalUseCase } from '@stereo/application/use-cases/aggregate-fingerprint-signal.use-case'
import { RunStereoUseCase } from '@stereo/application/use-cases/run-stereo.use-case'
import type { StereoInboundEventMap } from '@stereo/domain/events/stereo-event.map'

import { TrackEvent } from '@env/event-inventory'
/// Subscribes to `track.petrified.generated`, stores the fingerprint signal,
/// and checks if stereo can now start.
@Injectable()
export class PetrifiedGeneratedConsumer implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateFingerprint: AggregateFingerprintSignalUseCase,
    private readonly runStereo: RunStereoUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queueBase = optionalStringEnv(
      'NATS_QUEUE_GROUP',
      'shinod-ai-workers'
    )
    const queue = `${queueBase}-stereo-petrified`
    const consumer = new NatsQueueConsumerAdapter<StereoInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe(TrackEvent.PetrifiedGenerated, async (payload) => {
      await this.aggregateFingerprint.execute({
        trackId: payload.trackId,
        fingerprintHash: payload.fingerprintHash,
        audioHash: payload.audioHash,
        storage: payload.storage
      })

      await this.runStereo.execute({
        eventId: `stereo:petrified:${payload.trackId}`,
        trackId: payload.trackId
      })
    })
  }
}
