import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { requireStringEnv } from '@infra/env'

import { TranscriptionModule } from './transcription/transcription.module'
import { ProcessedEventEntity } from './transcription/infra/idempotency/processed-event.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: requireStringEnv('DATABASE_URL'),
      entities: [ProcessedEventEntity],
      synchronize: true
    }),
    TranscriptionModule
  ]
})
export class AppModule {}
