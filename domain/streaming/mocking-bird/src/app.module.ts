import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { FortMinorModule } from './fort-minor/fort-minor.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    FortMinorModule
  ]
})
export class AppModule {}
