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
export abstract class AggregateRoot<Props> extends Entity<Props> {
  private readonly pendingEvents: Event[] = []

  protected constructor(props: Props, id?: UniqueEntityId) {
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
