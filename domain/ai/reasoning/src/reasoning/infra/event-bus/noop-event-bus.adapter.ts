import type { EventBus, EventMap } from '@repo/event-bus'
export class NoopEventBusAdapter<Events extends EventMap> implements EventBus<Events> {
  async emit<E extends keyof Events>(_e: E, _p: Events[E]): Promise<void> {}
  on<E extends keyof Events>(_e: E, _h: (p: Events[E]) => void | Promise<void>): () => void { return () => undefined }
}
