import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AudioHashPort } from '@domain/ports'

import { TrackAudioHashEntity } from './track-audio-hash.entity'

@Injectable()
export class PostgresAudioHashAdapter extends AudioHashPort {
  constructor(
    @InjectRepository(TrackAudioHashEntity)
    private readonly repo: Repository<TrackAudioHashEntity>
  ) {
    super()
  }

  async findByHash(audioHash: string): Promise<string | null> {
    const entity = await this.repo.findOneBy({ audioHash })
    return entity?.trackId ?? null
  }

  async store(trackId: string, audioHash: string): Promise<void> {
    await this.repo.save({ trackId, audioHash })
  }
}
