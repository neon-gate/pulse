import type { Event } from './event.abstract'
import { Entity } from './entity.abstract'
import { UniqueEntityId } from './id.abstract'

/**
 * Aggregate root with event recording.
 *
 * @example
 * class OrderAggregate extends AggregateRoot<UniqueId> {
 *   constructor(readonly id: UniqueId) {
 *     super()
 *   }
 *
 *   confirm() {
 *     this.record(new OrderConfirmed({ orderId: this.id.toString() }))
 *   }
 * }
 */
export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private readonly pendingEvents: Event[] = []

  protected constructor(props: TProps, id?: UniqueEntityId) {
    super(props, id)
  }

  protected record(event: Event): void {
    this.pendingEvents.push(event)
  }

  pullEvents(): Event[] {
    const events = [...this.pendingEvents]
    this.pendingEvents.length = 0
    return events
  }
}
