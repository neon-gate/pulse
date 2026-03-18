import type { DomainEventPrimitive, EventMap } from '@pack/kernel'

import type { EventBus } from './event-bus.abstract'

export function createEventBus<Events extends EventMap>(): EventBus<Events> {
  type Envelope = DomainEventPrimitive<Events[keyof Events]>
  const listeners = new Map<keyof Events, Set<(p: Envelope) => void | Promise<void>>>()

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
      handlers.add(handler as (p: Envelope) => void | Promise<void>)

      return () => {
        listeners.get(event)?.delete(handler as (p: Envelope) => void | Promise<void>)
      }
    }
  }
}
