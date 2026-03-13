import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
  PostgresAudioHashAdapter,
  PostgresIdempotencyAdapter,
  ProcessedEventEntity,
  TrackAudioHashEntity
} from '@infra/idempotency'
import { MinioAudioStorageAdapter } from '@infra/object-storage/minio-audio-storage.adapter'
import { TrackUploadedHandler } from '@interface/event-handlers/track-uploaded.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessedEventEntity, TrackAudioHashEntity])
  ],
  controllers: [HealthController],
  providers: [
    GenerateFingerprintUseCase,
    natsConnectionProvider,
    fingerprintEventBusProvider,
    NatsLifecycleService,
    TrackUploadedHandler,
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
      useClass: PostgresIdempotencyAdapter
    },
    {
      provide: AudioHashPort,
      useClass: PostgresAudioHashAdapter
    }
  ]
})
export class FingerprintModule {}
