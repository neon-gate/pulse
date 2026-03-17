import { Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { TrackStatePort } from '@stereo/application/ports/track-state.port'

export interface AggregateFingerprintInput {
  trackId: string
  fingerprintHash: string
  audioHash: string
  storage: {
    bucket: string
    key: string
  }
}

/// Stores the fingerprint signal so stereo can proceed once both signals
/// are available.
@Injectable()
export class AggregateFingerprintSignalUseCase extends UseCase<
  [input: AggregateFingerprintInput],
  void
> {
  constructor(private readonly trackState: TrackStatePort) {
    super()
  }

  async execute(input: AggregateFingerprintInput): Promise<void> {
    await this.trackState.markFingerprintReady(
      input.trackId,
      input.fingerprintHash,
      input.audioHash,
      input.storage
    )
  }
}
