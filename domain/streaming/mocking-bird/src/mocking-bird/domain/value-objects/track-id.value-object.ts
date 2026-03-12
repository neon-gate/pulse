import { ValueObject } from '@repo/kernel'

interface TrackIdProps {
  value: string
}

export class TrackId extends ValueObject<TrackIdProps> {
  private constructor(props: TrackIdProps) {
    super(props)
  }

  static create(value: string): TrackId {
    return new TrackId({ value })
  }

  toString(): string {
    return this.props.value
  }
}
