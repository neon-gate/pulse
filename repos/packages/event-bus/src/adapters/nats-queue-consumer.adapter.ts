import { type NatsConnection, StringCodec } from 'nats'

import type { EventHandler } from '../event-handler'
import type { DomainEventPrimitive, EventMap } from '@pack/kernel'

/// Subscribes to NATS subjects using a queue group for competing-consumer
/// load balancing. Multiple instances sharing the same `queue` name each
/// receive at most one copy of each message.
export class NatsQueueConsumerAdapter<Events extends EventMap> {
  private readonly sc = StringCodec()
  private readonly unsubscribers: Array<() => void> = []

  constructor(
    private readonly nc: NatsConnection,
    private readonly queue: string
  ) {}

  /// Subscribe to `event` with queue-group semantics.
  subscribe<EventName extends keyof Events>(
    event: EventName,
    handler: EventHandler<DomainEventPrimitive<Events[EventName]>>
  ): () => void {
    const sub = this.nc.subscribe(String(event), { queue: this.queue })

    void (async () => {
      for await (const msg of sub) {
        try {
          const decoded = JSON.parse(
            this.sc.decode(msg.data)
          ) as DomainEventPrimitive<Events[EventName]>
          await handler(decoded)
        } catch {
          // Message-level errors are handled by the caller's use case.
          // The loop must not break on individual failures.
        }
      }
    })()

    const unsubscribe = () => sub.unsubscribe()
    this.unsubscribers.push(unsubscribe)
    return unsubscribe
  }

  /// Cancel all active subscriptions managed by this adapter.
  unsubscribeAll(): void {
    for (const fn of this.unsubscribers) fn()
    this.unsubscribers.length = 0
  }
}
