import type { EventBus } from './event-bus'
import type { EventMap } from './event-map'
import type { EventHandler } from './event-handler'

export function createEventBus<Events extends EventMap>(): EventBus<Events> {
  const listeners = new Map<keyof Events, Set<EventHandler<unknown>>>()

  return {
    async emit(event, payload) {
      const handlers = listeners.get(event)
      if (!handlers) return

      for (const handler of handlers) {
        await handler(payload)
      }
    },

    on(event, handler) {
      let handlers = listeners.get(event)
      if (!handlers) {
        handlers = new Set()
        listeners.set(event, handlers)
      }
      handlers.add(handler as EventHandler<unknown>)

      return () => {
        listeners.get(event)?.delete(handler as EventHandler<unknown>)
      }
    }
  }
}
