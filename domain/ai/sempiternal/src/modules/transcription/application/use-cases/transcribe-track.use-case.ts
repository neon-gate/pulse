import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { AudioStoragePort } from '@core/infra/minio/audio-storage.port'
import { IdempotencyPort } from '@transcription/application/ports/idempotency.port'
import { TranscriptionEventBusPort } from '@transcription/application/ports/transcription-event-bus.port'
import { TranscriberPort } from '@transcription/application/ports/transcriber.port'

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
    @Inject(TranscriptionEventBusPort)
    private readonly events: TranscriptionEventBusPort,
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
      .emit('track.transcription.started', {
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
          .emit('track.transcription.failed', {
            trackId,
            errorCode: 'TRANSCRIPTION_FAILED',
            message
          })
          .catch(() => undefined)
        return
      }

      void this.events
        .emit('track.transcription.completed', {
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
