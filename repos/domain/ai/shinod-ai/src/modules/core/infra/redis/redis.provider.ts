import type { Provider } from '@nestjs/common'
import Redis from 'ioredis'

import { requireStringEnvCompute } from '@repo/environment'

export const REDIS_CLIENT = 'REDIS_CLIENT'

/// Creates a Redis client from the REDIS_URL environment variable.
export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => new Redis(requireStringEnvCompute('REDIS_URL'))
}
