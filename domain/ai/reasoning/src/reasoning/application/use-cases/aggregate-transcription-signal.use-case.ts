import { Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { ReasoningEventBusPort, TrackStatePort } from '@domain/ports'

export interface AggregateTranscriptionInput {
  trackId: string
  text: string
  language: string
  durationInSeconds: number
}

/// Stores the transcription signal for a track and triggers reasoning if both
/// signals are now available.
@Injectable()
export class AggregateTranscriptionSignalUseCase extends UseCase<
  [input: AggregateTranscriptionInput],
  void
> {
  constructor(
    @Inject(ReasoningEventBusPort)
    private readonly events: ReasoningEventBusPort,
    private readonly trackState: TrackStatePort
  ) {
    super()
  }

  async execute(input: AggregateTranscriptionInput): Promise<void> {
    await this.trackState.markTranscriptionReady(
      input.trackId,
      input.text,
      input.language,
      input.durationInSeconds
    )
  }
}
