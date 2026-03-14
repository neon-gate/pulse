import { Module } from '@nestjs/common'

import { REDIS_CLIENT, redisProvider } from './redis.provider'

/// Provides and exports a Redis client.
@Module({
  providers: [redisProvider],
  exports: [REDIS_CLIENT]
})
export class RedisModule {}
