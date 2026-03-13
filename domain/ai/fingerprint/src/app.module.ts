import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { requireStringEnv } from '@infra/env'

import { FingerprintModule } from './fingerprint/fingerprint.module'
import { ProcessedEventEntity } from './fingerprint/infra/idempotency/processed-event.entity'
import { TrackAudioHashEntity } from './fingerprint/infra/idempotency/track-audio-hash.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: requireStringEnv('DATABASE_URL'),
      entities: [ProcessedEventEntity, TrackAudioHashEntity],
      synchronize: true
    }),
    FingerprintModule
  ]
})
export class AppModule {}
