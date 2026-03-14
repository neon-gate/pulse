import { Module } from '@nestjs/common'

import { GenerateFingerprintUseCase } from '@fingerprint/application/use-cases/generate-fingerprint.use-case'
import { FingerprintEventBusPort } from '@fingerprint/application/ports/fingerprint-event-bus.port'
import { FingerprintGeneratorPort } from '@fingerprint/application/ports/fingerprint-generator.port'
import { AudioHashPort } from '@fingerprint/application/ports/audio-hash.port'
import { IdempotencyPort } from '@fingerprint/application/ports/idempotency.port'
import { ChromaprintAdapter } from '@fingerprint/infra/adapters/chromaprint.adapter'
import { fingerprintEventBusProvider } from '@fingerprint/infra/adapters/fingerprint-event-bus.provider'
import { RedisAudioHashAdapter } from '@fingerprint/infra/adapters/redis-audio-hash.adapter'
import { RedisIdempotencyAdapter } from '@fingerprint/infra/adapters/redis-idempotency.adapter'
import { TrackUploadedConsumer } from '@fingerprint/interface/consumers/track-uploaded.consumer'

/// Handles acoustic fingerprinting of uploaded tracks.
///
/// Consumes: track.uploaded
/// Emits: track.fingerprint.generated, track.song.unknown,
///        track.duplicate.detected, track.fingerprint.failed
@Module({
  providers: [
    GenerateFingerprintUseCase,
    fingerprintEventBusProvider,
    TrackUploadedConsumer,
    { provide: FingerprintGeneratorPort, useClass: ChromaprintAdapter },
    { provide: IdempotencyPort, useClass: RedisIdempotencyAdapter },
    { provide: AudioHashPort, useClass: RedisAudioHashAdapter }
  ]
})
export class FingerprintModule {}
