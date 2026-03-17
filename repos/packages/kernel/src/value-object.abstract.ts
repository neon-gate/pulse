/**
 * Base value object with structural equality.
 *
 * @example
 * class Email extends ValueObject<{ value: string }> {
 *   get value() {
 *     return this.props.value
 *   }
 * }
 */
export abstract class ValueObject<Props> {
  protected readonly props: Props

  constructor(props: Props) {
    this.props = Object.freeze(props)
  }

  equals(vo?: ValueObject<Props>): boolean {
    if (!vo) return false
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
