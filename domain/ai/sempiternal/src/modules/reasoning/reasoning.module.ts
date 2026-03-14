import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  AggregateFingerprintSignalUseCase
} from '@reasoning/application/use-cases/aggregate-fingerprint-signal.use-case'
import {
  AggregateTranscriptionSignalUseCase
} from '@reasoning/application/use-cases/aggregate-transcription-signal.use-case'
import { RunReasoningUseCase } from '@reasoning/application/use-cases/run-reasoning.use-case'
import { IdempotencyPort } from '@reasoning/application/ports/idempotency.port'
import { ReasonerPort } from '@reasoning/application/ports/reasoner.port'
import { TrackStatePort } from '@reasoning/application/ports/track-state.port'
import { AiSdkReasonerAdapter } from '@reasoning/infra/adapters/ai-sdk-reasoner.adapter'
import { MongoIdempotencyAdapter } from '@reasoning/infra/adapters/mongo-idempotency.adapter'
import { MongoTrackStateAdapter } from '@reasoning/infra/adapters/mongo-track-state.adapter'
import {
  ProcessedEventDocument,
  ProcessedEventSchema
} from '@reasoning/infra/adapters/processed-event.schema'
import { reasoningEventBusProvider } from '@reasoning/infra/adapters/reasoning-event-bus.provider'
import {
  TrackProcessingStateDocument,
  TrackProcessingStateSchema
} from '@reasoning/infra/adapters/track-processing-state.schema'
import {
  FingerprintGeneratedConsumer
} from '@reasoning/interface/consumers/fingerprint-generated.consumer'
import {
  TranscriptionCompletedConsumer
} from '@reasoning/interface/consumers/transcription-completed.consumer'

/// Aggregates fingerprint and transcription signals and runs AI reasoning
/// to produce an approval or rejection decision for each track.
///
/// Consumes: track.fingerprint.generated, track.transcription.completed
/// Emits: track.reasoning.started, track.approved, track.rejected,
///        track.reasoning.failed
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
  providers: [
    AggregateFingerprintSignalUseCase,
    AggregateTranscriptionSignalUseCase,
    RunReasoningUseCase,
    reasoningEventBusProvider,
    FingerprintGeneratedConsumer,
    TranscriptionCompletedConsumer,
    { provide: ReasonerPort, useClass: AiSdkReasonerAdapter },
    { provide: IdempotencyPort, useClass: MongoIdempotencyAdapter },
    { provide: TrackStatePort, useClass: MongoTrackStateAdapter }
  ]
})
export class ReasoningModule {}
