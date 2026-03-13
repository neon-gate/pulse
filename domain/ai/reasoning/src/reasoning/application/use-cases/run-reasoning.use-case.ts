import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import {
  IdempotencyPort,
  ReasonerPort,
  ReasoningEventBusPort,
  TrackStatePort
} from '@domain/ports'

export interface RunReasoningInput {
  eventId: string
  trackId: string
}

/// Triggered when both fingerprint and transcription signals are ready for a
/// given track. Runs AI reasoning and emits the approval decision.
@Injectable()
export class RunReasoningUseCase extends UseCase<
  [input: RunReasoningInput],
  void
> {
  constructor(
    @Inject(ReasoningEventBusPort)
    private readonly events: ReasoningEventBusPort,
    private readonly trackState: TrackStatePort,
    private readonly reasoner: ReasonerPort,
    private readonly idempotency: IdempotencyPort
  ) {
    super()
  }

  async execute(input: RunReasoningInput): Promise<void> {
    const { eventId, trackId } = input

    if (await this.idempotency.hasProcessed(eventId)) return

    const state = await this.trackState.findOrCreate(trackId)

    if (!state.fingerprintReady || !state.transcriptionReady) return
    if (state.reasoningStarted) return

    await this.trackState.markReasoningStarted(trackId)

    void this.events
      .emit('track.reasoning.started', {
        trackId,
        startedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    let result: Awaited<ReturnType<ReasonerPort['reason']>>

    try {
      result = await this.reasoner.reason({
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
        .emit('track.reasoning.failed', {
          trackId,
          errorCode: 'AI_REASONING_FAILED',
          message
        })
        .catch(() => undefined)
      return
    }

    if (result.decision === 'approved') {
      void this.events
        .emit('track.approved', {
          trackId,
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
