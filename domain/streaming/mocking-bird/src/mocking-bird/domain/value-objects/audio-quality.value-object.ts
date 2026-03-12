import { ValueObject } from '@repo/kernel'

export type AudioQualityLevel = '96k' | '128k' | '192k' | '320k'

interface AudioQualityProps {
  value: AudioQualityLevel
}

export class AudioQuality extends ValueObject<AudioQualityProps> {
  private constructor(props: AudioQualityProps) {
    super(props)
  }

  static create(value: AudioQualityLevel): AudioQuality {
    return new AudioQuality({ value })
  }

  toString(): AudioQualityLevel {
    return this.props.value
  }

  static readonly Low = AudioQuality.create('96k')
  static readonly Medium = AudioQuality.create('128k')
  static readonly High = AudioQuality.create('192k')
  static readonly Ultra = AudioQuality.create('320k')
}
