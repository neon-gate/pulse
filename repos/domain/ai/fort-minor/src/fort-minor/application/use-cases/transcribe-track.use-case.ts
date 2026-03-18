import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@pack/kernel'

import { AudioStoragePort } from '@env/core'
import { TrackEvent } from '@env/event-inventory'
import {
  IdempotencyPort,
  FortMinorEventBusPort,
  TranscriberPort
} from '@application/ports'

export interface TranscribeTrackInput {
  eventId: string
  trackId: string
  storage: { bucket: string; key: string }
}

type TranscribeTrackArgs = [input: TranscribeTrackInput]

@Injectable()
export class TranscribeTrackUseCase
  implements UseCase<TranscribeTrackArgs, void>
{
  @Inject(FortMinorEventBusPort)
  private readonly events!: FortMinorEventBusPort

  @Inject(AudioStoragePort)
  private readonly audioStorage!: AudioStoragePort

  @Inject(TranscriberPort)
  private readonly transcriber!: TranscriberPort

  @Inject(IdempotencyPort)
  private readonly idempotency!: IdempotencyPort

  async execute(input: TranscribeTrackInput): Promise<void> {
    const { eventId, trackId, storage } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    void this.events.emit(TrackEvent.FortMinorStarted, {
      trackId,
      startedAt: new Date().toISOString()
    })

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
