import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { mongoDbName, mongoUri } from './mongodb.provider'

/// Provides and exports a MongoDB connection via MongooseModule.
@Module({
  imports: [
    MongooseModule.forRoot(mongoUri(), { dbName: mongoDbName() })
  ],
  exports: [MongooseModule]
})
export class MongodbModule {}
