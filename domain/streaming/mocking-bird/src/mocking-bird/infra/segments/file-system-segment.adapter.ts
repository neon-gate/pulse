import { Injectable, NotFoundException } from '@nestjs/common'
import { mkdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import { SegmentStorePort } from '@domain/ports'
import {
  DEFAULT_TRACK_FILE,
  DEFAULT_TRACK_ID
} from '@domain/value-objects'

@Injectable()
export class FileSystemSegmentAdapter implements SegmentStorePort {
  private readonly baseDir =
    process.env.MOCKINGBIRD_DATA_DIR ?? path.join(process.cwd(), 'data')
  private readonly outputBaseDir =
    process.env.MOCKINGBIRD_OUTPUT_DIR ?? path.join(this.baseDir, 'streams')

  private readonly trackMap = new Map<string, string>([
    [DEFAULT_TRACK_ID.toString(), DEFAULT_TRACK_FILE.toString()]
  ])

  async playlistExists(trackId: string): Promise<boolean> {
    const filePath = path.join(this.outputBaseDir, trackId, 'playlist.m3u8')
    try {
      await stat(filePath)
      return true
    } catch {
      return false
    }
  }

  async getPlaylist(trackId: string) {
    const filePath = path.join(this.outputBaseDir, trackId, 'playlist.m3u8')
    try {
      const data = await readFile(filePath)
      return {
        data,
        contentType: 'application/vnd.apple.mpegurl'
      }
    } catch {
      throw new NotFoundException('Playlist not found')
    }
  }

  async getSegment(trackId: string, segment: string) {
    const filePath = path.join(this.outputBaseDir, trackId, segment)
    try {
      const data = await readFile(filePath)
      return {
        data,
        contentType: 'video/mp2t'
      }
    } catch {
      throw new NotFoundException('Segment not found')
    }
  }

  async ensureOutputDir(trackId: string): Promise<string> {
    const outputDir = path.join(this.outputBaseDir, trackId)
    await mkdir(outputDir, { recursive: true })
    return outputDir
  }

  async getInputFile(trackId: string): Promise<string> {
    const fileName = this.trackMap.get(trackId)

    if (!fileName) {
      throw new NotFoundException('Track not found')
    }

    const filePath = path.join(this.baseDir, fileName)
    try {
      await stat(filePath)
      return filePath
    } catch {
      throw new NotFoundException('Track source not found')
    }
  }
}
