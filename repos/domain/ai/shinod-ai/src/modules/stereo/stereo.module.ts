import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  AggregateFingerprintSignalUseCase
} from '@stereo/application/use-cases/aggregate-fingerprint-signal.use-case'
import {
  AggregateTranscriptionSignalUseCase
} from '@stereo/application/use-cases/aggregate-transcription-signal.use-case'
import { RunStereoUseCase } from '@stereo/application/use-cases/run-stereo.use-case'
import { IdempotencyPort } from '@stereo/application/ports/idempotency.port'
import { StereoPort } from '@stereo/application/ports/stereo.port'
import { TrackStatePort } from '@stereo/application/ports/track-state.port'
import { AiSdkStereoAdapter } from '@stereo/infra/adapters/ai-sdk-stereo.adapter'
import { MongoIdempotencyAdapter } from '@stereo/infra/adapters/mongo-idempotency.adapter'
import { MongoTrackStateAdapter } from '@stereo/infra/adapters/mongo-track-state.adapter'
import {
  ProcessedEventDocument,
  ProcessedEventSchema
} from '@stereo/infra/adapters/processed-event.schema'
import { stereoEventBusProvider } from '@stereo/infra/adapters/stereo-event-bus.provider'
import {
  TrackProcessingStateDocument,
  TrackProcessingStateSchema
} from '@stereo/infra/adapters/track-processing-state.schema'
import {
  PetrifiedGeneratedConsumer
} from '@stereo/interface/consumers/petrified-generated.consumer'
import {
  TranscriptionCompletedConsumer
} from '@stereo/interface/consumers/transcription-completed.consumer'

/// Aggregates fingerprint and transcription signals and runs AI reasoning
/// to produce an approval or rejection decision for each track.
///
/// Consumes: track.petrified.generated, track.fort-minor.completed
/// Emits: track.stereo.started, track.approved, track.rejected,
///        track.stereo.failed
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
    RunStereoUseCase,
    stereoEventBusProvider,
    PetrifiedGeneratedConsumer,
    TranscriptionCompletedConsumer,
    { provide: StereoPort, useClass: AiSdkStereoAdapter },
    { provide: IdempotencyPort, useClass: MongoIdempotencyAdapter },
    { provide: TrackStatePort, useClass: MongoTrackStateAdapter }
  ]
})
export class StereoModule {}
