import { ValueObject } from '@repo/kernel'

interface TrackFileProps {
  value: string
}

export class TrackFile extends ValueObject<TrackFileProps> {
  private constructor(props: TrackFileProps) {
    super(props)
  }

  static create(value: string): TrackFile {
    return new TrackFile({ value })
  }

  toString(): string {
    return this.props.value
  }
}
