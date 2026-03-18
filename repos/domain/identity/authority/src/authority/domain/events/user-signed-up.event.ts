import { DomainEvent } from '@pack/kernel'
import type { AuthorityProvider } from '@domain/value-objects'

import { AuthorityEvent } from '@env/event-inventory'

export interface UserSignedUpPayload {
  userId: string
  email: string
  provider: AuthorityProvider
  name?: string | null
}

export class UserSignedUpEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserSignedUpPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName() {
    return AuthorityEvent.UserSignedUp
  }

  get eventVersion() {
    return 1
  }
}
