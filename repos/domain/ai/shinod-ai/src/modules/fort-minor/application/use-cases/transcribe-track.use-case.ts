import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@pack/kernel'

import { AudioStoragePort } from '@core/infra/minio/audio-storage.port'
import { IdempotencyPort } from '@fort-minor/application/ports/idempotency.port'
import { FortMinorEventBusPort } from '@fort-minor/application/ports/fort-minor-event-bus.port'
import { TranscriberPort } from '@fort-minor/application/ports/transcriber.port'

import { TrackEvent } from '@env/event-inventory'
export interface TranscribeTrackInput {
  eventId: string
  trackId: string
  storage: { bucket: string; key: string }
}

@Injectable()
export class TranscribeTrackUseCase extends UseCase<
  [input: TranscribeTrackInput],
  void
> {
  constructor(
    @Inject(FortMinorEventBusPort)
    private readonly events: FortMinorEventBusPort,
    private readonly audioStorage: AudioStoragePort,
    private readonly transcriber: TranscriberPort,
    private readonly idempotency: IdempotencyPort
  ) {
    super()
  }

  async execute(input: TranscribeTrackInput): Promise<void> {
    const { eventId, trackId, storage } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    void this.events
      .emit(TrackEvent.FortMinorStarted, {
        trackId,
        startedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    const downloaded = await this.audioStorage.download(
      storage.bucket,
      storage.key
    )

    try {
      let result: Awaited<ReturnType<TranscriberPort['transcribe']>>

      try {
        result = await this.transcriber.transcribe(downloaded.filePath)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Transcription failed'
        void this.events
          .emit(TrackEvent.FortMinorFailed, {
            trackId,
            errorCode: 'FORT_MINOR_FAILED',
            message
          })
          .catch(() => undefined)
        return
      }

      void this.events
        .emit(TrackEvent.FortMinorCompleted, {
          trackId,
          language: result.language,
          text: result.text,
          segments: result.segments,
          durationInSeconds: result.durationInSeconds,
          completedAt: new Date().toISOString()
        })
        .catch(() => undefined)

      await this.idempotency.markProcessed(eventId)
    } finally {
      await downloaded.cleanup()
    }
  }
}
