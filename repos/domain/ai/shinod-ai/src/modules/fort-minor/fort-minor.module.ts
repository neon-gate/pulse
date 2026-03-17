import { Module } from '@nestjs/common'

import { TranscribeTrackUseCase } from '@fort-minor/application/use-cases/transcribe-track.use-case'
import { FortMinorEventBusPort } from '@fort-minor/application/ports/fort-minor-event-bus.port'
import { TranscriberPort } from '@fort-minor/application/ports/transcriber.port'
import { IdempotencyPort } from '@fort-minor/application/ports/idempotency.port'
import { AiSdkTranscriberAdapter } from '@fort-minor/infra/adapters/ai-sdk-transcriber.adapter'
import { fortMinorEventBusProvider } from '@fort-minor/infra/adapters/fort-minor-event-bus.provider'
import { RedisIdempotencyAdapter } from '@fort-minor/infra/adapters/redis-idempotency.adapter'
import { PetrifiedGeneratedConsumer } from '@fort-minor/interface/consumers/petrified-generated.consumer'

/// Handles audio transcription using OpenAI Whisper.
///
/// Consumes: track.petrified.generated
/// Emits: track.fort-minor.started, track.fort-minor.completed,
///        track.fort-minor.failed
@Module({
  providers: [
    TranscribeTrackUseCase,
    fortMinorEventBusProvider,
    PetrifiedGeneratedConsumer,
    { provide: TranscriberPort, useClass: AiSdkTranscriberAdapter },
    { provide: IdempotencyPort, useClass: RedisIdempotencyAdapter }
  ]
})
export class FortMinorModule {}
