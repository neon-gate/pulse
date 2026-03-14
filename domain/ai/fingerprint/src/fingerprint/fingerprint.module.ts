import { Module } from '@nestjs/common'

import { GenerateFingerprintUseCase } from '@application/use-cases'
import {
  AudioHashPort,
  AudioStoragePort,
  FingerprintGeneratorPort,
  IdempotencyPort
} from '@domain/ports'
import {
  fingerprintEventBusProvider,
  NatsConnectionToken,
  natsConnectionProvider,
  NatsLifecycleService
} from '@infra/event-bus'
import { ChromaprintAdapter } from '@infra/fingerprint/chromaprint.adapter'
import {
  REDIS_CLIENT,
  redisProvider,
  RedisIdempotencyAdapter,
  RedisAudioHashAdapter
} from '@infra/idempotency'
import { MinioAudioStorageAdapter } from '@infra/object-storage/minio-audio-storage.adapter'
import { TrackUploadedHandler } from '@interface/event-handlers/track-uploaded.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  controllers: [HealthController],
  providers: [
    GenerateFingerprintUseCase,
    natsConnectionProvider,
    fingerprintEventBusProvider,
    NatsLifecycleService,
    TrackUploadedHandler,
    redisProvider,
    {
      provide: FingerprintGeneratorPort,
      useClass: ChromaprintAdapter
    },
    {
      provide: AudioStoragePort,
      useClass: MinioAudioStorageAdapter
    },
    {
      provide: IdempotencyPort,
      useClass: RedisIdempotencyAdapter
    },
    {
      provide: AudioHashPort,
      useClass: RedisAudioHashAdapter
    }
  ]
})
export class FingerprintModule {}
