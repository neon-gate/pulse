import type { IdType } from '@types'

/**
 * Base identifier abstraction for entities, aggregates, and domain events.
 *
 * @param value - Underlying identifier value (typically opaque string)
 * @example
 * class OrderId extends Id<string> {}
 */
export abstract class Id<Value extends IdType = IdType> {
  readonly value: Value

  protected constructor(value: Value) {
    this.value = value
  }

  toString(): string {
    return String(this.value)
  }

  /**
   * Compare two identifiers by their raw value.
   *
   * @param other - Another identifier instance to compare against
   * @returns `true` when the stored values match
   * @example
   * const a = new OrderId('o-1')
   * const b = new OrderId('o-1')
   * a.equals(b) // true
   */
  equals(other?: Id<Value>): boolean {
    return Boolean(other && this.value === other.value)
  }
}
