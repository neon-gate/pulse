import { Inject, Injectable } from '@nestjs/common'
import type Redis from 'ioredis'

import { REDIS_CLIENT } from '@core/infra/redis/redis.provider'
import { AudioHashPort } from '@petrified/application/ports/audio-hash.port'

@Injectable()
export class RedisAudioHashAdapter extends AudioHashPort {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {
    super()
  }

  async findByHash(audioHash: string): Promise<string | null> {
    return this.redis.get(`petrified:audio-hash:${audioHash}`)
  }

  async store(trackId: string, audioHash: string): Promise<void> {
    await this.redis.set(`petrified:audio-hash:${audioHash}`, trackId)
  }
}
