import type { EventBus, EventMap } from '@repo/event-bus'

export class NoopEventBusAdapter<Events extends EventMap>
  implements EventBus<Events>
{
  async emit<EventName extends keyof Events>(
    _event: EventName,
    _payload: Events[EventName]
  ): Promise<void> {
    /* intentionally empty */
  }

  on<EventName extends keyof Events>(
    _event: EventName,
    _handler: (payload: Events[EventName]) => void | Promise<void>
  ): () => void {
    return () => undefined
  }
}
