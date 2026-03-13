import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TranscribeTrackUseCase } from '@application/use-cases'
import { AudioStoragePort, IdempotencyPort, TranscriberPort } from '@domain/ports'
import {
  natsConnectionProvider,
  NatsLifecycleService,
  transcriptionEventBusProvider,
  NatsConnectionToken
} from '@infra/event-bus'
import { ProcessedEventEntity, PostgresIdempotencyAdapter } from '@infra/idempotency'
import { MinioAudioStorageAdapter } from '@infra/object-storage/minio-audio-storage.adapter'
import { AiSdkTranscriberAdapter } from '@infra/transcription/ai-sdk-transcriber.adapter'
import { FingerprintGeneratedHandler } from '@interface/event-handlers/fingerprint-generated.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEventEntity])],
  controllers: [HealthController],
  providers: [
    TranscribeTrackUseCase,
    natsConnectionProvider,
    transcriptionEventBusProvider,
    NatsLifecycleService,
    FingerprintGeneratedHandler,
    { provide: TranscriberPort, useClass: AiSdkTranscriberAdapter },
    { provide: AudioStoragePort, useClass: MinioAudioStorageAdapter },
    { provide: IdempotencyPort, useClass: PostgresIdempotencyAdapter }
  ]
})
export class TranscriptionModule {}
