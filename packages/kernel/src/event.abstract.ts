import { UniqueId } from './id.abstract'

/**
 * Base domain event.
 *
 * @example
 * class UserRegistered extends Event<{ userId: string }> {
 *   get eventName() {
 *     return 'user.registered'
 *   }
 *
 *   get eventVersion() {
 *     return 1
 *   }
 * }
 */
export abstract class Event<Payload = unknown> {
  public readonly id: UniqueId
  public readonly occurredOn: Date
  public readonly payload: Payload

  constructor(
    payload: Payload,
    options?: {
      id?: UniqueId
      occurredOn?: Date
    }
  ) {
    this.id = options?.id ?? UniqueId.create()
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
