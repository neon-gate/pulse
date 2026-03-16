import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { requireStringEnvCompute } from '@repo/environment'

import { BackstageModule } from './backstage/backstage.module'

const MONGO_URI = requireStringEnvCompute('MONGO_URI')
const MONGO_DB_NAME = requireStringEnvCompute('MONGO_DB_NAME')

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, { dbName: MONGO_DB_NAME }),
    BackstageModule
  ]
})
export class AppModule {}
