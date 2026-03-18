import type { EventBus, EventMap } from '@pack/kernel'

export function createEventBus<Events extends EventMap>(): EventBus<Events> {
  // Events extends EventMap implies Events[keyof Events] extends EventPayload;
  // TS does not infer this from the class constraint.
  type Payload = Events[keyof Events]
  const listeners = new Map<keyof Events, Set<(p: Payload) => void | Promise<void>>>()

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
      handlers.add(handler as (p: Payload) => void | Promise<void>)

      return () => {
        listeners.get(event)?.delete(handler as (p: Payload) => void | Promise<void>)
      }
    }
  }
}
