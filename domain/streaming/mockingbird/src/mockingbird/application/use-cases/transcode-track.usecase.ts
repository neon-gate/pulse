import { Injectable } from '@nestjs/common'
import { UseCase } from '@repo/kernel'
import * as fs from 'fs'
import * as path from 'path'

import {
  MockingbirdEventBusPort,
  StoragePort,
  TranscoderPort
} from '@domain/ports'

@Injectable()
export class TranscodeTrackUseCase extends UseCase<
  [trackId: string, sourceStorage: { bucket: string; key: string }],
  void
> {
  constructor(
    private readonly storage: StoragePort,
    private readonly transcoder: TranscoderPort,
    private readonly eventBus: MockingbirdEventBusPort
  ) {
    super()
  }

  async execute(
    trackId: string,
    sourceStorage: { bucket: string; key: string }
  ): Promise<void> {
    let original: string | null = null

    try {
      await this.eventBus.emit('track.transcoding.started', { trackId })

      original = await this.storage.download(sourceStorage)

      const [file128, file320] = await Promise.all([
        this.transcoder.transcode(original, 128),
        this.transcoder.transcode(original, 320)
      ])

      const hlsRoot = path.join('/tmp/hls', trackId)
      const [hls128, hls320] = await Promise.all([
        this.transcoder.generateHls(original, 128, hlsRoot),
        this.transcoder.generateHls(original, 320, hlsRoot)
      ])

      const key128 = `transcoded/${trackId}/128.mp3`
      const key320 = `transcoded/${trackId}/320.mp3`
      const transcodedBucket = process.env.STORAGE_TRANSCODED_BUCKET ?? 'transcoded'

      await this.storage.upload(key128, file128)
      await this.storage.upload(key320, file320)

      await this.eventBus.emit('track.transcoding.completed', {
        trackId,
        variants: [
          { bitrate: 128, bucket: transcodedBucket, key: key128 },
          { bitrate: 320, bucket: transcodedBucket, key: key320 }
        ],
        completedAt: new Date().toISOString()
      })

      const masterPlaylist = this.writeMasterPlaylist(hlsRoot, [
        { bitrate: 128, playlist: hls128.playlist },
        { bitrate: 320, playlist: hls320.playlist }
      ])

      await this.eventBus.emit('track.hls.generated', {
        trackId,
        masterPlaylist,
        variants: [
          { bitrate: 128, playlist: hls128.playlist, segmentsDir: hls128.segmentsDir },
          { bitrate: 320, playlist: hls320.playlist, segmentsDir: hls320.segmentsDir }
        ],
        generatedAt: new Date().toISOString()
      })
    } catch (error) {
      await this.eventBus.emit('track.transcoding.failed', {
        trackId,
        errorCode: 'TRANSCODING_FAILED',
        message: error instanceof Error ? error.message : String(error)
      })
      throw error
    } finally {
      if (original && fs.existsSync(original)) {
        try {
          fs.unlinkSync(original)
        } catch {
          // ignore cleanup errors
        }
      }
    }
  }

  private writeMasterPlaylist(
    rootDir: string,
    variants: Array<{ bitrate: number; playlist: string }>
  ): string {
    fs.mkdirSync(rootDir, { recursive: true })

    const lines = ['#EXTM3U', '#EXT-X-VERSION:3']
    for (const variant of variants) {
      lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${variant.bitrate * 1000}`)
      lines.push(`${variant.bitrate}/index.m3u8`)
    }

    const masterPlaylist = path.join(rootDir, 'master.m3u8')
    fs.writeFileSync(masterPlaylist, `${lines.join('\n')}\n`)

    return masterPlaylist
  }
}
