export interface TrackProcessingState {
  trackId: string
  fingerprintReady: boolean
  fingerprintHash: string | null
  audioHash: string | null
  transcriptionReady: boolean
  transcriptionText: string | null
  transcriptionLanguage: string | null
  transcriptionDuration: number | null
  reasoningStarted: boolean
}

/// Port for managing the event-join state of a track through the pipeline.
export abstract class TrackStatePort {
  abstract findOrCreate(trackId: string): Promise<TrackProcessingState>
  abstract markFingerprintReady(
    trackId: string,
    fingerprintHash: string,
    audioHash: string
  ): Promise<TrackProcessingState>
  abstract markTranscriptionReady(
    trackId: string,
    text: string,
    language: string,
    duration: number
  ): Promise<TrackProcessingState>
  abstract markReasoningStarted(trackId: string): Promise<void>
}
