import { Inject, Injectable } from '@nestjs/common'
import type Redis from 'ioredis'

import { REDIS_CLIENT } from '@core/infra/redis/redis.provider'
import { IdempotencyPort } from '@fingerprint/application/ports/idempotency.port'

const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

@Injectable()
export class RedisIdempotencyAdapter extends IdempotencyPort {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {
    super()
  }

  async hasProcessed(eventId: string): Promise<boolean> {
    const result = await this.redis.exists(
      `fingerprint:idempotency:${eventId}`
    )
    return result === 1
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.redis.set(
      `fingerprint:idempotency:${eventId}`,
      '1',
      'EX',
      IDEMPOTENCY_TTL_SECONDS
    )
  }
}
