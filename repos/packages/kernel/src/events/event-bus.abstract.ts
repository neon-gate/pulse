import { EventHandler } from './event-handler.abstract'
import { DomainEvent } from '../primitives'
import { ObjectPrimitive } from '../types'

/**
 * In-memory event bus that routes domain events to subscribed handlers.
 *
 * @example
 * class OrderEventBus extends EventBus<'Order', OrderEventPayload, OrderCreated> {
 *   // Handlers are registered via subscribe and invoked via publish
 * }
 */
export abstract class EventBus<
  Domain,
  Props extends ObjectPrimitive<Domain>,
  Event extends DomainEvent<Domain, Props>
> {
  private handlers: Map<Domain, EventHandler<Domain, Props, Event>[]> =
    new Map()

  /**
   * Subscribes a handler for a given event name.
   *
   * @param eventName - Domain event name to subscribe to
   * @param handler - Handler to invoke when the event is published
   * @example
   * eventBus.subscribe('Order', new OrderCreatedHandler())
   */
  subscribe(
    eventName: Domain,
    handler: EventHandler<Domain, Props, Event>
  ): void {
    const handlers = this.handlers.get(eventName) ?? []
    handlers.push(handler)
    this.handlers.set(eventName, handlers)
  }

  /**
   * Publishes an event to all subscribed handlers.
   *
   * @param event - Domain event to publish
   * @returns Promise that resolves when all handlers have completed
   * @example
   * await eventBus.publish(orderCreatedEvent)
   */
  async publish(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.eventName as Domain) ?? []

    await Promise.all(handlers.map((handler) => handler.handle(event)))
  }
}
