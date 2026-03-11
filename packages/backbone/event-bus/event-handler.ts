export type EventHandler<Payload = unknown> = (
  payload: Payload
) => void | Promise<void>
