import { Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import {
  MockingbirdEventBusPort,
  SegmentStorePort,
  TranscoderPort
} from '@domain/ports'
import {
  AudioQuality,
  DEFAULT_TRACK_ID,
  HlsSegmentDuration
} from '@domain/value-objects'

export interface StartPlaybackResult {
  trackId: string
  playlistPath: string
}

@Injectable()
export class StartPlaybackUseCase extends UseCase<
  [trackId?: string],
  StartPlaybackResult
> {
  constructor(
    private readonly segments: SegmentStorePort,
    private readonly transcoder: TranscoderPort,
    private readonly events: MockingbirdEventBusPort
  ) {
    super()
  }

  async execute(trackId?: string): Promise<StartPlaybackResult> {
    const resolvedTrackId = trackId ?? DEFAULT_TRACK_ID.toString()

    const inputFile = await this.segments.getInputFile(resolvedTrackId)
    const outputDir = await this.segments.ensureOutputDir(resolvedTrackId)

    const hasPlaylist = await this.segments.playlistExists(resolvedTrackId)

    if (!hasPlaylist) {
      const result = await this.transcoder.transcode({
        inputFile,
        outputDir,
        quality: AudioQuality.Medium,
        segmentDuration: HlsSegmentDuration.Normal
      })

      void this.events
        .emit('streaming.mocking-bird.transcode.completed', {
          trackId: resolvedTrackId,
          outputDir: result.outputDir,
          occurredAt: new Date().toISOString()
        })
        .catch(() => undefined)
    }

    const playlistPath = `/mocking-bird/${resolvedTrackId}/playlist`

    void this.events
      .emit('streaming.mocking-bird.stream.started', {
        trackId: resolvedTrackId,
        playlistPath,
        occurredAt: new Date().toISOString()
      })
      .catch(() => undefined)

    return {
      trackId: resolvedTrackId,
      playlistPath
    }
  }
}
