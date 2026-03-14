import type { EventBus, EventMap } from '@repo/event-bus'

export class NoopEventBusAdapter<Events extends EventMap> implements EventBus<Events> {
  async emit<EventName extends keyof Events>(_e: EventName, _p: Events[EventName]): Promise<void> {}
  on<EventName extends keyof Events>(_e: EventName, _h: (p: Events[EventName]) => void | Promise<void>): () => void { return () => undefined }
}

