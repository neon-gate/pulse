/**
 * Base constraint for event payloads.
 * All payloads in event maps should extend this.
 *
 * Recommended properties (see EVENT_ARCHITECTURE.md):
 * - entityId: identifier of the entity the event concerns
 * - occurredAt: ISO 8601 timestamp when the fact occurred
 */
export abstract class EventPayload {}
