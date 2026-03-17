import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { requireStringEnvCompute } from '@repo/environment'
import { DbConfigFlag } from '@infra/db'

import { SlimShadyModule } from './slim-shady/slim-shady.module'

@Module({
  imports: [
    MongooseModule.forRoot(requireStringEnvCompute(DbConfigFlag.MongoUri), {
      dbName: requireStringEnvCompute(DbConfigFlag.MongoDbName)
    }),

    SlimShadyModule
  ]
})
export class AppModule {}
