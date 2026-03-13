import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { ReasoningEventBusPort, TrackStatePort } from '@domain/ports'

export interface AggregateFingerprintInput {
  trackId: string
  fingerprintHash: string
  audioHash: string
}

/// Stores the fingerprint signal for a track and triggers reasoning if both
/// signals are now available.
@Injectable()
export class AggregateFingerprintSignalUseCase extends UseCase<
  [input: AggregateFingerprintInput],
  void
> {
  constructor(
    @Inject(ReasoningEventBusPort)
    private readonly events: ReasoningEventBusPort,
    private readonly trackState: TrackStatePort
  ) {
    super()
  }

  async execute(input: AggregateFingerprintInput): Promise<void> {
    await this.trackState.markFingerprintReady(
      input.trackId,
      input.fingerprintHash,
      input.audioHash
    )
  }
}
