import { OccurredOnType } from './occured-on.type'
import { IdType } from './id.type'

/**
 * Metadata for domain events (event id and occurrence time).
 *
 * @example
 * const meta: MetaType = {
 *   eventId: crypto.randomUUID(),
 *   occurredOn: new Date()
 * }
 */
export interface MetaType {
  eventId: IdType
  occurredOn: OccurredOnType
}
