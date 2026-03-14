import { Global, Module } from '@nestjs/common'

import { MongodbModule } from '@core/infra/mongodb/mongodb.module'
import { MinioModule } from '@core/infra/minio/minio.module'
import { NatsModule } from '@core/infra/nats/nats.module'
import { RedisModule } from '@core/infra/redis/redis.module'

/// Shared infrastructure module for the Sempiternal application.
///
/// Provides and exports MongoDB, MinIO, NATS, and Redis to all feature
/// modules without requiring each module to import them individually.
@Global()
@Module({
  imports: [MongodbModule, MinioModule, NatsModule, RedisModule],
  exports: [MongodbModule, MinioModule, NatsModule, RedisModule]
})
export class CoreModule {}
