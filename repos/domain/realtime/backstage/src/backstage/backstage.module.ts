import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  BroadcastPipelineEventUseCase,
  GetTrackPipelineUseCase,
  ListActivePipelinesUseCase,
  ListAllPipelinesUseCase,
  ListFailedPipelinesUseCase,
  RecordPipelineEventUseCase
} from '@application/use-cases'
import { EventStreamPortToken } from '@application/ports/event-stream.port'
import { PipelineRepositoryPort } from '@domain/repositories'
import { natsConnectionProvider, NatsLifecycleService } from '@pack/event-bus'
import { MockEventGeneratorService } from '@infra/mock/mock-event-generator.service'
import {
  MongoPipelineAdapter,
  TrackPipelineDocument,
  TrackPipelineSchemaDefinition
} from '@infra/persistence'
import { SocketIOEventStreamAdapter } from '@infra/websocket/socketio-event-stream.adapter'
import { HealthController, PipelinesController } from '@interface/http'
import { PipelineEventConsumer } from '@interface/event-handlers/pipeline-event.consumer'
import { PipelineGateway } from '@interface/gateways/pipeline.gateway'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrackPipelineDocument.name,
        schema: TrackPipelineSchemaDefinition
      }
    ])
  ],
  controllers: [HealthController, PipelinesController],
  providers: [
    PipelineGateway,
    BroadcastPipelineEventUseCase,
    GetTrackPipelineUseCase,
    ListActivePipelinesUseCase,
    ListAllPipelinesUseCase,
    ListFailedPipelinesUseCase,
    RecordPipelineEventUseCase,
    MockEventGeneratorService,
    PipelineEventConsumer,
    natsConnectionProvider,
    NatsLifecycleService,
    {
      provide: EventStreamPortToken,
      useFactory: (gateway: PipelineGateway) =>
        new SocketIOEventStreamAdapter(gateway),
      inject: [PipelineGateway]
    },
    {
      provide: PipelineRepositoryPort,
      useClass: MongoPipelineAdapter
    }
  ]
})
export class BackstageModule {}
