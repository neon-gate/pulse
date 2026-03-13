import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import * as fs from 'node:fs'
import * as path from 'node:path'

import {
  logAxiomEvent,
  LogLevel,
  SoundgardenLogEvent
} from '@infra/axiom/observability'
import { UPLOAD_STORAGE_PATH } from '@infra/upload-config.provider'

const UPLOAD_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

/// Removes upload directories that have exceeded the 24-hour TTL.
@Injectable()
export class UploadCleanupService {
  constructor(
    @Inject(UPLOAD_STORAGE_PATH)
    private readonly storagePath: string
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async removeExpiredUploads(): Promise<void> {
    const cutoff = Date.now() - UPLOAD_TTL_MS
    let removed = 0

    try {
      const entries = await fs.promises.readdir(this.storagePath, {
        withFileTypes: true
      })

      for (const entry of entries) {
        if (!entry.isDirectory()) continue

        const dirPath = path.join(this.storagePath, entry.name)

        try {
          const stat = await fs.promises.stat(dirPath)

          if (stat.mtimeMs < cutoff) {
            await fs.promises.rm(dirPath, { recursive: true, force: true })
            removed++
          }
        } catch {
          // Skip entries that cannot be stat'd or removed.
        }
      }

      void logAxiomEvent({
        event: SoundgardenLogEvent.CleanupCompleted,
        level: LogLevel.Info,
        context: { removed }
      })
    } catch (error) {
      void logAxiomEvent({
        event: SoundgardenLogEvent.CleanupFailed,
        level: LogLevel.Warn,
        context: {
          errorMessage: error instanceof Error ? error.message : 'unknown'
        }
      })
    }
  }
}
