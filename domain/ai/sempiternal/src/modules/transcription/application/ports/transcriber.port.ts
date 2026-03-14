export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface TranscriptionOutput {
  language: string
  text: string
  segments: TranscriptSegment[]
  durationInSeconds: number
}

/// Port for transcribing audio files to text.
export abstract class TranscriberPort {
  abstract transcribe(filePath: string): Promise<TranscriptionOutput>
}
