import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MockingbirdModule } from './mocking-bird/mocking-bird.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MockingbirdModule
  ]
})
export class AppModule {}
