import { Event } from './event.abstract'

/**
 * Domain event base class.
 */
export abstract class DomainEvent<Payload = unknown> extends Event<Payload> {}
