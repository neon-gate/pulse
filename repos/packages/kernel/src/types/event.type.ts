import { IdType } from './id.type'
import { ObjectType } from './object.type'
import { OccurredOnType } from './occured-on.type'

/**
 * Serialized domain event envelope.
 *
 * @example
 * const event: EventType<'Order', OrderPayload> = {
 *   eventId: crypto.randomUUID(),
 *   eventName: 'Order',
 *   eventVersion: 1,
 *   aggregateId: 'o-1',
 *   occurredOn: new Date(),
 *   payload: { status: 'created' }
 * }
 */
export interface EventType<Domain, Payload = ObjectType<Domain>> {
  eventId: IdType
  eventName: string
  eventVersion: number
  aggregateId: IdType
  occurredOn: OccurredOnType
  payload: Payload
}
