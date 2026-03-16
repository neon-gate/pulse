import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@repo/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@repo/event-bus'
import { optionalStringEnvCompute } from '@repo/environment'
import { AggregateTranscriptionSignalUseCase } from '@stereo/application/use-cases/aggregate-transcription-signal.use-case'
import { RunStereoUseCase } from '@stereo/application/use-cases/run-stereo.use-case'
import type { StereoInboundEventMap } from '@stereo/domain/events/stereo-event.map'

/// Subscribes to `track.fort-minor.completed`, stores the transcription
/// signal, and checks if stereo can now start.
@Injectable()
export class TranscriptionCompletedConsumer implements OnApplicationBootstrap {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null,
    private readonly aggregateTranscription: AggregateTranscriptionSignalUseCase,
    private readonly runStereo: RunStereoUseCase
  ) {}

  onApplicationBootstrap(): void {
    if (!this.connection) return

    const queue = optionalStringEnvCompute('NATS_QUEUE_GROUP', 'shinod-ai-workers')
    const consumer = new NatsQueueConsumerAdapter<StereoInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe('track.fort-minor.completed', async (payload) => {
      await this.aggregateTranscription.execute({
        trackId: payload.trackId,
        text: payload.text,
        language: payload.language,
        durationInSeconds: payload.durationInSeconds
      })

      await this.runStereo.execute({
        eventId: `stereo:fort-minor:${payload.trackId}`,
        trackId: payload.trackId
      })
    })
  }
}
