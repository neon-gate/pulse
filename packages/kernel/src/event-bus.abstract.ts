/**
 * Minimal event bus contract for domain ports.
 *
 * @example
 * class AuthEventBus extends EventBus<AuthEventMap> {}
 */
export abstract class EventBus<Events extends Record<string, unknown>> {
  abstract emit<EventName extends keyof Events>(
    event: EventName,
    payload: Events[EventName]
  ): Promise<void>

  abstract on<EventName extends keyof Events>(
    event: EventName,
    handler: (payload: Events[EventName]) => void | Promise<void>
  ): () => void
}
