import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import {
  AudioHashPort,
  AudioStoragePort,
  FingerprintEventBusPort,
  FingerprintGeneratorPort,
  IdempotencyPort
} from '@domain/ports'

export interface GenerateFingerprintInput {
  eventId: string
  trackId: string
  storage: { bucket: string; key: string }
}

@Injectable()
export class GenerateFingerprintUseCase extends UseCase<
  [input: GenerateFingerprintInput],
  void
> {
  constructor(
    @Inject(FingerprintEventBusPort)
    private readonly events: FingerprintEventBusPort,
    private readonly audioStorage: AudioStoragePort,
    private readonly fingerprintGenerator: FingerprintGeneratorPort,
    private readonly idempotency: IdempotencyPort,
    private readonly audioHash: AudioHashPort
  ) {
    super()
  }

  async execute(input: GenerateFingerprintInput): Promise<void> {
    const { eventId, trackId, storage } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    const downloaded = await this.audioStorage.download(
      storage.bucket,
      storage.key
    )

    try {
      let result: { fingerprintHash: string; audioHash: string }

      try {
        result = await this.fingerprintGenerator.generate(downloaded.filePath)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Fingerprint generation failed'
        void this.events
          .emit('track.fingerprint.failed', {
            trackId,
            errorCode: 'FINGERPRINT_GENERATION_FAILED',
            message
          })
          .catch(() => undefined)
        return
      }

      const { fingerprintHash, audioHash } = result

      const originalTrackId = await this.audioHash.findByHash(audioHash)

      if (originalTrackId !== null) {
        void this.events
          .emit('track.duplicate.detected', {
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
        .emit('track.fingerprint.generated', {
          trackId,
          fingerprintHash,
          audioHash,
          storage,
          generatedAt: new Date().toISOString()
        })
        .catch(() => undefined)

      void this.events
        .emit('track.song.unknown', {
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
