import type { EventMap } from './event-map'
import type { EventHandler } from './event-handler'

export interface EventBus<Events extends EventMap> {
  emit<EventName extends keyof Events>(
    event: EventName,
    payload: Events[EventName]
  ): Promise<void>

  on<EventName extends keyof Events>(
    event: EventName,
    handler: EventHandler<Events[EventName]>
  ): () => void
}
