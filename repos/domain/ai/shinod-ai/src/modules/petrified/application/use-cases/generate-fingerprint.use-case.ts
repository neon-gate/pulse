import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@pack/kernel'

import { AudioStoragePort } from '@core/infra/minio/audio-storage.port'
import { AudioHashPort } from '@petrified/application/ports/audio-hash.port'
import { PetrifiedEventBusPort } from '@petrified/application/ports/petrified-event-bus.port'
import {
  PetrifiedGeneratorPort,
  type FingerprintResult
} from '@petrified/application/ports/petrified-generator.port'
import { TrackEvent } from '@env/event-inventory'
import { IdempotencyPort } from '@petrified/application/ports/idempotency.port'

export interface GenerateFingerprintInput {
  eventId: string
  trackId: string
  storage: { bucket: string; key: string }
  fortMinorStorage: { bucket: string; key: string }
}

@Injectable()
export class GenerateFingerprintUseCase extends UseCase<
  [input: GenerateFingerprintInput],
  void
> {
  constructor(
    @Inject(PetrifiedEventBusPort)
    private readonly events: PetrifiedEventBusPort,
    private readonly audioStorage: AudioStoragePort,
    private readonly fingerprintGenerator: PetrifiedGeneratorPort,
    private readonly idempotency: IdempotencyPort,
    private readonly audioHash: AudioHashPort
  ) {
    super()
  }

  async execute(input: GenerateFingerprintInput): Promise<void> {
    const { eventId, trackId, storage, fortMinorStorage } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    const downloaded = await this.audioStorage.download(
      storage.bucket,
      storage.key
    )

    try {
      let result: FingerprintResult

      try {
        result = await this.fingerprintGenerator.generate(downloaded.filePath)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Fingerprint generation failed'
        void this.events
          .emit(TrackEvent.PetrifiedFailed, {
            trackId,
            errorCode: 'PETRIFIED_GENERATION_FAILED',
            message
          })
          .catch(() => undefined)
        return
      }

      const { fingerprintHash, audioHash } = result
      const originalTrackId = await this.audioHash.findByHash(audioHash)

      if (originalTrackId !== null) {
        void this.events
          .emit(TrackEvent.DuplicateDetected, {
            trackId,
            originalTrackId,
            audioHash,
            detectedAt: new Date().toISOString()
          })
          .catch(() => undefined)
        await this.idempotency.markProcessed(eventId)
        return
      }

      await this.audioHash.store(trackId, audioHash)

      void this.events
        .emit(TrackEvent.PetrifiedGenerated, {
          trackId,
          fingerprintHash,
          audioHash,
          storage: fortMinorStorage,
          generatedAt: new Date().toISOString()
        })
        .catch(() => undefined)

      void this.events
        .emit(TrackEvent.PetrifiedSongUnknown, {
          trackId,
          audioHash,
          detectedAt: new Date().toISOString()
        })
        .catch(() => undefined)

      await this.idempotency.markProcessed(eventId)
    } finally {
      await downloaded.cleanup()
    }
  }
}
