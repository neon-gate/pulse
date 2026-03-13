import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
  AggregateFingerprintSignalUseCase,
  AggregateTranscriptionSignalUseCase,
  RunReasoningUseCase
} from '@application/use-cases'
import { IdempotencyPort, ReasonerPort, TrackStatePort } from '@domain/ports'
import {
  natsConnectionProvider,
  NatsLifecycleService,
  reasoningEventBusProvider
} from '@infra/event-bus'
import {
  PostgresIdempotencyAdapter,
  PostgresTrackStateAdapter,
  ProcessedEventEntity,
  TrackProcessingStateEntity
} from '@infra/idempotency'
import { AiSdkReasonerAdapter } from '@infra/reasoning/ai-sdk-reasoner.adapter'
import { FingerprintGeneratedHandler } from '@interface/event-handlers/fingerprint-generated.handler'
import { TranscriptionCompletedHandler } from '@interface/event-handlers/transcription-completed.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessedEventEntity, TrackProcessingStateEntity])
  ],
  controllers: [HealthController],
  providers: [
    RunReasoningUseCase,
    AggregateFingerprintSignalUseCase,
    AggregateTranscriptionSignalUseCase,
    natsConnectionProvider,
    reasoningEventBusProvider,
    NatsLifecycleService,
    FingerprintGeneratedHandler,
    TranscriptionCompletedHandler,
    { provide: ReasonerPort, useClass: AiSdkReasonerAdapter },
    { provide: IdempotencyPort, useClass: PostgresIdempotencyAdapter },
    { provide: TrackStatePort, useClass: PostgresTrackStateAdapter }
  ]
})
export class ReasoningModule {}
