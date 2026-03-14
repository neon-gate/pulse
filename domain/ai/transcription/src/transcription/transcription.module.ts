import { Module } from '@nestjs/common'

import { TranscribeTrackUseCase } from '@application/use-cases'
import { AudioStoragePort, IdempotencyPort, TranscriberPort } from '@domain/ports'
import {
  natsConnectionProvider,
  NatsLifecycleService,
  transcriptionEventBusProvider,
  NatsConnectionToken
} from '@infra/event-bus'
import {
  redisProvider,
  RedisIdempotencyAdapter
} from '@infra/idempotency'
import { MinioAudioStorageAdapter } from '@infra/object-storage/minio-audio-storage.adapter'
import { AiSdkTranscriberAdapter } from '@infra/transcription/ai-sdk-transcriber.adapter'
import { FingerprintGeneratedHandler } from '@interface/event-handlers/fingerprint-generated.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  controllers: [HealthController],
  providers: [
    TranscribeTrackUseCase,
    natsConnectionProvider,
    transcriptionEventBusProvider,
    NatsLifecycleService,
    FingerprintGeneratedHandler,
    redisProvider,
    { provide: TranscriberPort, useClass: AiSdkTranscriberAdapter },
    { provide: AudioStoragePort, useClass: MinioAudioStorageAdapter },
    { provide: IdempotencyPort, useClass: RedisIdempotencyAdapter }
  ]
})
export class TranscriptionModule {}
