/**
 * Base error for event-related failures.
 *
 * @example
 * throw new EventError('Failed to publish', { eventName: 'user.registered' })
 */
export class EventError extends Error {
  readonly eventName?: string

  constructor(message: string, options?: { eventName?: string; cause?: unknown }) {
    super(message)
    this.name = 'EventError'
    this.eventName = options?.eventName
    if (options?.cause) {
      ;(this as { cause?: unknown }).cause = options.cause
    }
  }
}
