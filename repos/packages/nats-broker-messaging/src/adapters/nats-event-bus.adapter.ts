import type { EventPrimitive } from '@pack/kernel'
import type { NatsConnection } from 'nats'

import { NatsConsumer } from '../nats/nats-consumer.adapter'
import { NatsPublisher } from '../nats/nats-publisher.adapter'
import type { EventContract } from '../types/event-contract.type'
import { EventBus } from '../ports/event-bus.port'

/**
 * Backward-compatible adapter preserving the legacy `emit`/`on` API.
 *
 * Prefer `NatsPublisher` and `NatsConsumer` directly for new code.
 */
export class NatsEventBusAdapter<Events extends EventContract>
  extends EventBus<Events>
{
  private readonly publisher: NatsPublisher<Events>
  private readonly consumer: NatsConsumer<Events>

  constructor(
    connection: NatsConnection,
    queue = 'default-workers'
  ) {
    super()
    this.publisher = new NatsPublisher<Events>(connection)
    this.consumer = new NatsConsumer<Events>(connection, queue)
  }

  /**
   * Emits an envelope to the NATS subject.
   */
  async emit<EventName extends keyof Events & string>(
    event: EventName,
    payload: EventPrimitive<Events[EventName]>
  ): Promise<void> {
    await this.publisher.publish(event, payload)
  }

  /**
   * Registers an envelope handler for the subject.
   */
  on<EventName extends keyof Events & string>(
    event: EventName,
    handler: (payload: EventPrimitive<Events[EventName]>) => void | Promise<void>
  ): () => void {
    return this.consumer.subscribe(event, handler)
  }
}
