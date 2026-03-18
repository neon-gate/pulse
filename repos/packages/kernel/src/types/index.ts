import type { EventType } from './event.type'
import type { IdType } from './id.type'
import type { MetaType } from './meta.type'
import type { ObjectType } from './object.type'
import type { OccurredOnType } from './occured-on.type'

export type { EventType, IdType, MetaType, ObjectType, OccurredOnType }

// Backwards-compatible “Primitive” aliases used by kernel abstractions.
export type IdPrimitive = IdType
export type OccurredOnPrimitive = OccurredOnType
export type MetaPrimitive = MetaType

/**
 * Plain object constraint for event payloads.
 * `Domain` is kept only for generic coupling in higher-level types.
 */
export type ObjectPrimitive<Domain = unknown> = Record<string, unknown> & {
  readonly __domain__?: Domain
}

/**
 * Serialized domain event envelope used for transport/persistence.
 */
export interface EventPrimitive<Payload = Record<string, unknown>> {
  eventId: IdPrimitive
  eventName: string
  eventVersion: number
  aggregateId: IdPrimitive
  occurredOn: OccurredOnPrimitive
  payload: Payload
}
