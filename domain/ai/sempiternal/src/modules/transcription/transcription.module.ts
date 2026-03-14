import { Module } from '@nestjs/common'

import { TranscribeTrackUseCase } from '@transcription/application/use-cases/transcribe-track.use-case'
import { TranscriptionEventBusPort } from '@transcription/application/ports/transcription-event-bus.port'
import { TranscriberPort } from '@transcription/application/ports/transcriber.port'
import { IdempotencyPort } from '@transcription/application/ports/idempotency.port'
import { AiSdkTranscriberAdapter } from '@transcription/infra/adapters/ai-sdk-transcriber.adapter'
import { transcriptionEventBusProvider } from '@transcription/infra/adapters/transcription-event-bus.provider'
import { RedisIdempotencyAdapter } from '@transcription/infra/adapters/redis-idempotency.adapter'
import { FingerprintGeneratedConsumer } from '@transcription/interface/consumers/fingerprint-generated.consumer'

/// Handles audio transcription using OpenAI Whisper.
///
/// Consumes: track.fingerprint.generated
/// Emits: track.transcription.started, track.transcription.completed,
///        track.transcription.failed
@Module({
  providers: [
    TranscribeTrackUseCase,
    transcriptionEventBusProvider,
    FingerprintGeneratedConsumer,
    { provide: TranscriberPort, useClass: AiSdkTranscriberAdapter },
    { provide: IdempotencyPort, useClass: RedisIdempotencyAdapter }
  ]
})
export class TranscriptionModule {}
