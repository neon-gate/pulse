import { UniqueIdPrimitive } from '@primitives'

export abstract class Event<Payload = unknown> {
  public readonly id: UniqueIdPrimitive
  public readonly occurredOn: Date
  public readonly payload: Payload

  constructor(
    payload: Payload,
    options?: {
      id?: UniqueIdPrimitive
      occurredOn?: Date
    }
  ) {
    this.id = options?.id ?? new UniqueIdPrimitive()
    this.occurredOn = options?.occurredOn ?? new Date()
    this.payload = payload
  }

  abstract get eventName(): string
  abstract get eventVersion(): number

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.eventName,
      version: this.eventVersion,
      occurredOn: this.occurredOn,
      payload: this.payload
    }
  }
}
