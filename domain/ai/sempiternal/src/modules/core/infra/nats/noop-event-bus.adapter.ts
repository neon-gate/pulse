import type { EventBus, EventMap } from '@repo/event-bus'

/// A no-op event bus used when NATS is not configured (local dev mode).
export class NoopEventBusAdapter<Events extends EventMap>
  implements EventBus<Events>
{
  async emit<EventName extends keyof Events>(
    _event: EventName,
    _payload: Events[EventName]
  ): Promise<void> {}

  on<EventName extends keyof Events>(
    _event: EventName,
    _handler: (payload: Events[EventName]) => void | Promise<void>
  ): () => void {
    return () => undefined
  }
}
