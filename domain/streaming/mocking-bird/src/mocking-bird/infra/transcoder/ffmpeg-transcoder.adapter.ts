import { Injectable } from '@nestjs/common'
import { spawn } from 'node:child_process'

import {
  TranscodeOptions,
  TranscodeResult,
  TranscoderPort
} from '@domain/ports'

@Injectable()
export class FfmpegTranscoderAdapter implements TranscoderPort {
  async transcode(options: TranscodeOptions): Promise<TranscodeResult> {
    const { inputFile, outputDir, quality, segmentDuration } = options

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-i',
        inputFile,
        '-codec:a',
        'aac',
        '-b:a',
        quality.toString(),
        '-hls_time',
        segmentDuration.toNumber().toString(),
        '-hls_list_size',
        '0',
        '-hls_playlist_type',
        'vod',
        '-hls_segment_filename',
        `${outputDir}/segment_%03d.ts`,
        `${outputDir}/playlist.m3u8`
      ])

      ffmpeg.on('error', (error) => {
        reject(error)
      })

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve({
            outputDir,
            playlistPath: `${outputDir}/playlist.m3u8`
          })
          return
        }

        reject(new Error(`ffmpeg exited with code ${code ?? 'unknown'}`))
      })
    })
  }
}
