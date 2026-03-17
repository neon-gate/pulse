import { Module } from '@nestjs/common'

import { GenerateFingerprintUseCase } from '@petrified/application/use-cases/generate-fingerprint.use-case'
import { PetrifiedEventBusPort } from '@petrified/application/ports/petrified-event-bus.port'
import { PetrifiedGeneratorPort } from '@petrified/application/ports/petrified-generator.port'
import { AudioHashPort } from '@petrified/application/ports/audio-hash.port'
import { IdempotencyPort } from '@petrified/application/ports/idempotency.port'
import { ChromaprintAdapter } from '@petrified/infra/adapters/chromaprint.adapter'
import { petrifiedEventBusProvider } from '@petrified/infra/adapters/petrified-event-bus.provider'
import { RedisAudioHashAdapter } from '@petrified/infra/adapters/redis-audio-hash.adapter'
import { RedisIdempotencyAdapter } from '@petrified/infra/adapters/redis-idempotency.adapter'
import { TrackUploadedConsumer } from '@petrified/interface/consumers/track-uploaded.consumer'

/// Handles acoustic fingerprinting of uploaded tracks.
///
/// Consumes: track.uploaded
/// Emits: track.petrified.generated, track.petrified.song.unknown,
///        track.duplicate.detected, track.petrified.failed
@Module({
  providers: [
    GenerateFingerprintUseCase,
    petrifiedEventBusProvider,
    TrackUploadedConsumer,
    { provide: PetrifiedGeneratorPort, useClass: ChromaprintAdapter },
    { provide: IdempotencyPort, useClass: RedisIdempotencyAdapter },
    { provide: AudioHashPort, useClass: RedisAudioHashAdapter }
  ]
})
export class PetrifiedModule {}
