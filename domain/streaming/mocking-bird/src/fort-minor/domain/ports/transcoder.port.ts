import { AudioQuality, HlsSegmentDuration } from '@domain/value-objects'

export interface TranscodeResult {
  outputDir: string
  playlistPath: string
}

export interface TranscodeOptions {
  inputFile: string
  outputDir: string
  quality: AudioQuality
  segmentDuration: HlsSegmentDuration
}

export abstract class TranscoderPort {
  abstract transcode(options: TranscodeOptions): Promise<TranscodeResult>
}
