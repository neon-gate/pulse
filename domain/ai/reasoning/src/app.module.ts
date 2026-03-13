import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { requireStringEnv } from '@infra/env'

import { ReasoningModule } from './reasoning/reasoning.module'
import { ProcessedEventEntity } from './reasoning/infra/idempotency/processed-event.entity'
import { TrackProcessingStateEntity } from './reasoning/infra/idempotency/track-processing-state.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: requireStringEnv('DATABASE_URL'),
      entities: [ProcessedEventEntity, TrackProcessingStateEntity],
      synchronize: true
    }),
    ReasoningModule
  ]
})
export class AppModule {}
