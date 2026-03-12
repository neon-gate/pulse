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
export abstract class ValueObject<TProps> {
  protected readonly props: TProps

  constructor(props: TProps) {
    this.props = Object.freeze(props)
  }

  equals(vo?: ValueObject<TProps>): boolean {
    if (!vo) return false
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
