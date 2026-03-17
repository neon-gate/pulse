import type { EventPayload } from './event-payload.abstract'

/**
 * Base for event maps. Maps event names to payload types.
 * Use as constraint: `interface MyEventMap extends EventMap { ... }`
 */
export abstract class EventMap<
  Events extends Record<string, EventPayload> = Record<string, EventPayload>
> {}
