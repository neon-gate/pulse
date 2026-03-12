export type IdPrimitive = string

/**
 * Base identifier type for entities and events.
 *
 * @example
 * const orderId = new OrderId('order_123')
 */
export abstract class Id<Primitive extends IdPrimitive = IdPrimitive> {
  readonly value: Primitive

  protected constructor(value: Primitive) {
    this.value = value
  }

  toString(): string {
    return String(this.value)
  }

  equals(other?: Id<Primitive>): boolean {
    return Boolean(other && this.value === other.value)
  }
}

/**
 * Simple unique identifier with a lightweight default generator.
 *
 * @example
 * const id = UniqueId.create()
 */
export class UniqueId extends Id {
  static create(value?: string): UniqueId {
    if (value) return new UniqueId(value)
    return new UniqueId(
      `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    )
  }

  protected constructor(value: string) {
    super(value)
  }
}

/**
 * Entity-specific identifier.
 *
 * @example
 * const id = UniqueEntityId.create()
 */
export class UniqueEntityId extends UniqueId {
  static create(value?: string): UniqueEntityId {
    if (value) return new UniqueEntityId(value)
    return new UniqueEntityId(
      `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    )
  }

  protected constructor(value: string) {
    super(value)
  }
}
