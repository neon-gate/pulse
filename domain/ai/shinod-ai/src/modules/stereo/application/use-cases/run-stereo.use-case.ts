import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { IdempotencyPort } from '@stereo/application/ports/idempotency.port'
import { StereoPort } from '@stereo/application/ports/stereo.port'
import { StereoEventBusPort } from '@stereo/application/ports/stereo-event-bus.port'
import { TrackStatePort } from '@stereo/application/ports/track-state.port'

export interface RunStereoInput {
  eventId: string
  trackId: string
}

/// Triggered when both fingerprint and transcription signals are ready.
/// Runs AI reasoning and emits the approval or rejection decision.
@Injectable()
export class RunStereoUseCase extends UseCase<
  [input: RunStereoInput],
  void
> {
  constructor(
    @Inject(StereoEventBusPort)
    private readonly events: StereoEventBusPort,
    private readonly trackState: TrackStatePort,
    private readonly stereo: StereoPort,
    private readonly idempotency: IdempotencyPort
  ) {
    super()
  }

  async execute(input: RunStereoInput): Promise<void> {
    const { eventId, trackId } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    const state = await this.trackState.findOrCreate(trackId)

    if (!state.fingerprintReady || !state.transcriptionReady) return
    if (state.stereoStarted) return
    if (!state.sourceStorage) return

    await this.trackState.markStereoStarted(trackId)

    void this.events
      .emit('track.stereo.started', {
        trackId,
        startedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    let result: Awaited<ReturnType<StereoPort['reason']>>

    try {
      result = await this.stereo.reason({
        trackId,
        fingerprintHash: state.fingerprintHash ?? '',
        audioHash: state.audioHash ?? '',
        transcriptionText: state.transcriptionText ?? '',
        transcriptionLanguage: state.transcriptionLanguage ?? 'unknown',
        transcriptionDuration: state.transcriptionDuration ?? 0
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'AI reasoning failed'
      void this.events
        .emit('track.stereo.failed', {
          trackId,
          errorCode: 'AI_STEREO_FAILED',
          message
        })
        .catch(() => undefined)
      return
    }

    if (result.decision === 'approved') {
      void this.events
        .emit('track.approved', {
          trackId,
          sourceStorage: state.sourceStorage,
          objectKey: state.sourceStorage.key,
          decision: 'approved',
          reason: result.reason,
          approvedAt: new Date().toISOString()
        })
        .catch(() => undefined)
    } else {
      void this.events
        .emit('track.rejected', {
          trackId,
          decision: 'rejected',
          reason: result.reason,
          rejectedAt: new Date().toISOString()
        })
        .catch(() => undefined)
    }

    await this.idempotency.markProcessed(eventId)
  }
}
