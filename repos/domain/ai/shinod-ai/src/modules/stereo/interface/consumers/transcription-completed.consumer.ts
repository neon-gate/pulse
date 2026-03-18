import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { NatsQueueConsumerAdapter } from '@pack/event-bus'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from '@pack/event-bus'
import { optionalStringEnv } from '@env/lib'
import { AggregateTranscriptionSignalUseCase } from '@stereo/application/use-cases/aggregate-transcription-signal.use-case'
import { RunStereoUseCase } from '@stereo/application/use-cases/run-stereo.use-case'
import type { StereoInboundEventMap } from '@stereo/domain/events/stereo-event.map'

import { TrackEvent } from '@env/event-inventory'
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

    const queueBase = optionalStringEnv(
      'NATS_QUEUE_GROUP',
      'shinod-ai-workers'
    )
    const queue = `${queueBase}-stereo-transcription`
    const consumer = new NatsQueueConsumerAdapter<StereoInboundEventMap>(
      this.connection,
      queue
    )

    consumer.subscribe(TrackEvent.FortMinorCompleted, async (payload) => {
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
