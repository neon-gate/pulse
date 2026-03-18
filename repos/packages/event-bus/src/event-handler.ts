export type EventHandler<Payload = Record<string, unknown>> = (
  payload: Payload
) => void | Promise<void>
