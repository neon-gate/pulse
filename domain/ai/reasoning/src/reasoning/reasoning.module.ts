import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

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
  MongoIdempotencyAdapter,
  MongoTrackStateAdapter,
  ProcessedEventDocument,
  ProcessedEventSchema,
  TrackProcessingStateDocument,
  TrackProcessingStateSchema
} from '@infra/idempotency'
import { AiSdkReasonerAdapter } from '@infra/reasoning/ai-sdk-reasoner.adapter'
import { FingerprintGeneratedHandler } from '@interface/event-handlers/fingerprint-generated.handler'
import { TranscriptionCompletedHandler } from '@interface/event-handlers/transcription-completed.handler'
import { HealthController } from '@interface/http/health.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessedEventDocument.name, schema: ProcessedEventSchema },
      {
        name: TrackProcessingStateDocument.name,
        schema: TrackProcessingStateSchema
      }
    ])
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
    { provide: IdempotencyPort, useClass: MongoIdempotencyAdapter },
    { provide: TrackStatePort, useClass: MongoTrackStateAdapter }
  ]
})
export class ReasoningModule {}
