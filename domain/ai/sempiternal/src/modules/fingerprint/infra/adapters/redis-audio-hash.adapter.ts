import { Inject, Injectable } from '@nestjs/common'
import type Redis from 'ioredis'

import { REDIS_CLIENT } from '@core/infra/redis/redis.provider'
import { AudioHashPort } from '@fingerprint/application/ports/audio-hash.port'

@Injectable()
export class RedisAudioHashAdapter extends AudioHashPort {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {
    super()
  }

  async findByHash(audioHash: string): Promise<string | null> {
    return this.redis.get(`fingerprint:audio-hash:${audioHash}`)
  }

  async store(trackId: string, audioHash: string): Promise<void> {
    await this.redis.set(`fingerprint:audio-hash:${audioHash}`, trackId)
  }
}
