import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { requireStringEnvCompute } from '@repo/environment'
import { DbConfigFlag } from '@infra/db'

import { AuthorityModule } from './authority/authority.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    MongooseModule.forRoot(requireStringEnvCompute(DbConfigFlag.MongoUri), {
      dbName: requireStringEnvCompute(DbConfigFlag.MongoDbName)
    }),

    AuthorityModule
  ]
})
export class AppModule {}
