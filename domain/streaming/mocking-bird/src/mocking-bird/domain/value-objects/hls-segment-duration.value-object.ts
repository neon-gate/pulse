import { ValueObject } from '@repo/kernel'

export type HlsSegmentSeconds = 4 | 6 | 10

interface HlsSegmentDurationProps {
  value: HlsSegmentSeconds
}

export class HlsSegmentDuration extends ValueObject<HlsSegmentDurationProps> {
  private constructor(props: HlsSegmentDurationProps) {
    super(props)
  }

  static create(value: HlsSegmentSeconds): HlsSegmentDuration {
    return new HlsSegmentDuration({ value })
  }

  toNumber(): HlsSegmentSeconds {
    return this.props.value
  }

  static readonly Short = HlsSegmentDuration.create(4)
  static readonly Normal = HlsSegmentDuration.create(6)
  static readonly Long = HlsSegmentDuration.create(10)
}
