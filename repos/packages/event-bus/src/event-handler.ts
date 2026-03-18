import type { EventPayload } from '@pack/kernel'

export type EventHandler<Payload extends EventPayload = EventPayload> = (
  payload: Payload
) => void | Promise<void>
