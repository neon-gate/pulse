import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import {
  TrackStatePort,
  type TrackProcessingState
} from '@domain/ports'

import { TrackProcessingStateEntity } from './track-processing-state.entity'

@Injectable()
export class PostgresTrackStateAdapter extends TrackStatePort {
  constructor(
    @InjectRepository(TrackProcessingStateEntity)
    private readonly repo: Repository<TrackProcessingStateEntity>
  ) {
    super()
  }

  async findOrCreate(trackId: string): Promise<TrackProcessingState> {
    let entity = await this.repo.findOneBy({ trackId })
    if (!entity) {
      entity = this.repo.create({ trackId })
      await this.repo.save(entity)
    }
    return this.toState(entity)
  }

  async markFingerprintReady(
    trackId: string,
    fingerprintHash: string,
    audioHash: string
  ): Promise<TrackProcessingState> {
    await this.repo.upsert(
      {
        trackId,
        fingerprintReady: true,
        fingerprintHash,
        audioHash
      },
      ['trackId']
    )
    return this.findOrCreate(trackId)
  }

  async markTranscriptionReady(
    trackId: string,
    text: string,
    language: string,
    duration: number
  ): Promise<TrackProcessingState> {
    await this.repo.upsert(
      {
        trackId,
        transcriptionReady: true,
        transcriptionText: text,
        transcriptionLanguage: language,
        transcriptionDuration: duration
      },
      ['trackId']
    )
    return this.findOrCreate(trackId)
  }

  async markReasoningStarted(trackId: string): Promise<void> {
    await this.repo.update({ trackId }, { reasoningStarted: true })
  }

  private toState(entity: TrackProcessingStateEntity): TrackProcessingState {
    return {
      trackId: entity.trackId,
      fingerprintReady: entity.fingerprintReady,
      fingerprintHash: entity.fingerprintHash,
      audioHash: entity.audioHash,
      transcriptionReady: entity.transcriptionReady,
      transcriptionText: entity.transcriptionText,
      transcriptionLanguage: entity.transcriptionLanguage,
      transcriptionDuration: entity.transcriptionDuration,
      reasoningStarted: entity.reasoningStarted
    }
  }
}
