import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { requireStringEnv } from '@infra/env'

import { ReasoningModule } from './reasoning/reasoning.module'

@Module({
  imports: [
    MongooseModule.forRoot(requireStringEnv('MONGO_URI'), {
      dbName: requireStringEnv('MONGO_DB_NAME')
    }),
    ReasoningModule
  ]
})
export class AppModule {}
