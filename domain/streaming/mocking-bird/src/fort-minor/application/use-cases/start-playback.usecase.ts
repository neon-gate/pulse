import { Injectable } from '@nestjs/common'

import {
  type FortMinorEventBus,
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

// TODO: must implement abstract class for use cases, use @Inject(FortMinorEventBusPort). params not set
@Injectable()
export class StartPlaybackUseCase {
  constructor(
    private readonly segments: SegmentStorePort,
    private readonly transcoder: TranscoderPort,
    private readonly events: FortMinorEventBus
  ) {}

  async execute(trackId?: string): Promise<StartPlaybackResult> {
    const resolvedTrackId = trackId ?? DEFAULT_TRACK_ID

    const inputFile = await this.segments.getInputFile(resolvedTrackId)
    const outputDir = await this.segments.ensureOutputDir(resolvedTrackId)

    const hasPlaylist = await this.segments.playlistExists(resolvedTrackId)

    if (!hasPlaylist) {
      const result = await this.transcoder.transcode({
        inputFile,
        outputDir,
        quality: AudioQuality.MEDIUM,
        segmentDuration: HlsSegmentDuration.NORMAL
      })

      void this.events
        .emit('streaming.fort-minor.transcode.completed', {
          trackId: resolvedTrackId,
          outputDir: result.outputDir,
          occurredAt: new Date().toISOString()
        })
        .catch(() => undefined)
    }

    const playlistPath = `/fort-minor/${resolvedTrackId}/playlist`

    void this.events
      .emit('streaming.fort-minor.stream.started', {
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
