import { DomainEvent } from '@pack/kernel'

import { AuthorityEvent } from '@env/event-inventory'

export interface UserLoggedOutPayload {
  userId: string
  sessionId: string
}

export class UserLoggedOutEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserLoggedOutPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName() {
    return AuthorityEvent.UserLoggedOut
  }

  get eventVersion() {
    return 1
  }
}
