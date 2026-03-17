import { Injectable, OnModuleInit } from '@nestjs/common'

import { HybridStorageEventBusPort } from '@domain/ports'
import { HLSPackage } from '@domain/entities/hls-package.entity'
import { PersistHLSPackageUseCase } from '@application/use-cases'

@Injectable()
export class HLSGeneratedConsumer implements OnModuleInit {
  private unsubscribe: (() => void) | null = null

  constructor(
    private readonly eventBus: HybridStorageEventBusPort,
    private readonly persistHLSPackage: PersistHLSPackageUseCase
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.eventBus.on(
      'track.hls.generated',
      async (payload) => {
        const pkg = new HLSPackage(
          payload.trackId,
          payload.masterPlaylist,
          payload.variants
        )

        console.log('[HybridStorage] Processing track.hls.generated', {
          trackId: payload.trackId
        })

        try {
          await this.persistHLSPackage.execute(pkg)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to persist HLS package'
          console.error('[HybridStorage] Failed to persist HLS package', {
            trackId: payload.trackId,
            error: message
          })
          await this.eventBus.emit('track.hls.failed', {
            trackId: payload.trackId,
            errorCode: 'HLS_PERSIST_FAILED',
            message
          })
        }
      }
    )

    console.log('[HybridStorage] Subscribed to track.hls.generated')
  }
}
