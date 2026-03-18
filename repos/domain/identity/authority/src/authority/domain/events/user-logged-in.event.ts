import { DomainEvent } from '@pack/kernel'
import type { AuthorityProvider } from '@domain/value-objects'

import { AuthorityEvent } from '@env/event-inventory'

export interface UserLoggedInPayload {
  userId: string
  email: string
  provider: AuthorityProvider
  sessionId: string
  ipAddress?: string | null
  userAgent?: string | null
}

export class UserLoggedInEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserLoggedInPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName() {
    return AuthorityEvent.UserLoggedIn
  }

  get eventVersion() {
    return 1
  }
}
