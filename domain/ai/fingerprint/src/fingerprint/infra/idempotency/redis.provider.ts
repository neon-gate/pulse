import type { Provider } from '@nestjs/common'
import Redis from 'ioredis'

import { requireStringEnv } from '@infra/env'

export const REDIS_CLIENT = 'REDIS_CLIENT'

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => new Redis(requireStringEnv('REDIS_URL'))
}
