import type {
  ObjectPrimitive,
  EventPrimitive,
  IdPrimitive,
  OccurredOnPrimitive,
  MetaPrimitive
} from '../types'

/**
 * Base class for domain events with metadata and serialization.
 *
 * @param aggregateId - Id of the aggregate that produced the event
 * @param props - Event payload
 * @param meta - Event metadata (eventId, occurredOn)
 * @example
 * class OrderCreated extends DomainEvent<'Order', OrderCreatedPayload> {
 *   get eventName() { return 'Order' }
 *   get eventVersion() { return 1 }
 *   static create(aggregateId: string, payload: OrderCreatedPayload) {
 *     return new OrderCreated(aggregateId, payload, { eventId: crypto.randomUUID(), occurredOn: new Date() })
 *   }
 * }
 */
export abstract class DomainEvent<
  Domain,
  Props extends ObjectPrimitive<Domain>
> {
  readonly eventId: IdPrimitive
  readonly aggregateId: IdPrimitive
  readonly occurredOn: OccurredOnPrimitive
  readonly props: Readonly<Props>

  protected constructor(
    aggregateId: IdPrimitive,
    props: Props,
    meta: MetaPrimitive
  ) {
    this.eventId = meta.eventId
    this.aggregateId = aggregateId
    this.occurredOn = meta.occurredOn
    this.props = Object.freeze(props)
  }

  /**
   * Domain event name (e.g. aggregate type).
   *
   * @returns Event name string
   */
  abstract get eventName(): string

  /**
   * Schema version for the event payload.
   *
   * @returns Version number
   */
  abstract get eventVersion(): number

  /**
   * Serializes the event to a plain object for transport or persistence.
   *
   * @returns Event primitive with eventId, eventName, eventVersion, aggregateId, occurredOn, payload
   * @example
   * const primitive = event.toPrimitive()
   * await eventBus.publish(primitive)
   */
  toPrimitive(): EventPrimitive<Props> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      payload: this.props
    }
  }
}
