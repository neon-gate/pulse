import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import {
  TrackStatePort,
  type TrackProcessingState
} from '@reasoning/application/ports/track-state.port'
import { TrackProcessingStateDocument } from './track-processing-state.schema'

@Injectable()
export class MongoTrackStateAdapter extends TrackStatePort {
  constructor(
    @InjectModel(TrackProcessingStateDocument.name)
    private readonly model: Model<TrackProcessingStateDocument>
  ) {
    super()
  }

  async findOrCreate(trackId: string): Promise<TrackProcessingState> {
    const doc = await this.model.findOneAndUpdate(
      { trackId },
      { $setOnInsert: { trackId } },
      { upsert: true, new: true }
    )
    return this.toState(doc!)
  }

  async markFingerprintReady(
    trackId: string,
    fingerprintHash: string,
    audioHash: string
  ): Promise<TrackProcessingState> {
    const doc = await this.model.findOneAndUpdate(
      { trackId },
      { $set: { fingerprintReady: true, fingerprintHash, audioHash } },
      { upsert: true, new: true }
    )
    return this.toState(doc!)
  }

  async markTranscriptionReady(
    trackId: string,
    text: string,
    language: string,
    duration: number
  ): Promise<TrackProcessingState> {
    const doc = await this.model.findOneAndUpdate(
      { trackId },
      {
        $set: {
          transcriptionReady: true,
          transcriptionText: text,
          transcriptionLanguage: language,
          transcriptionDuration: duration
        }
      },
      { upsert: true, new: true }
    )
    return this.toState(doc!)
  }

  async markReasoningStarted(trackId: string): Promise<void> {
    await this.model.updateOne(
      { trackId },
      { $set: { reasoningStarted: true } },
      { writeConcern: { w: 'majority' } }
    )
  }

  private toState(doc: TrackProcessingStateDocument): TrackProcessingState {
    return {
      trackId: doc.trackId,
      fingerprintReady: doc.fingerprintReady,
      fingerprintHash: doc.fingerprintHash,
      audioHash: doc.audioHash,
      transcriptionReady: doc.transcriptionReady,
      transcriptionText: doc.transcriptionText,
      transcriptionLanguage: doc.transcriptionLanguage,
      transcriptionDuration: doc.transcriptionDuration,
      reasoningStarted: doc.reasoningStarted
    }
  }
}
