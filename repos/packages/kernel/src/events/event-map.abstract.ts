import { ObjectPrimitive } from '../types'

/**
 * Maps raw event payloads to domain event primitives.
 *
 * @example
 * class OrderEventMap extends EventMap<'Order'> {
 *   mapEvents(events: ObjectPrimitive<'Order'>[]) {
 *     return events.map(e => ({ ...e, eventVersion: 1 }))
 *   }
 * }
 */
export abstract class EventMap<EventDomain> {
  /**
   * Maps raw events to the expected primitive shape.
   *
   * @param events - Raw event payloads to map
   * @returns Mapped event primitives
   */
  abstract mapEvents(
    events: ObjectPrimitive<EventDomain>[]
  ): ObjectPrimitive<EventDomain>[]
}
