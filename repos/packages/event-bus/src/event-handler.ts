import type { EventPayload } from '@repo/kernel'

export type EventHandler<Payload extends EventPayload = EventPayload> = (
  payload: Payload
) => void | Promise<void>
