import { DomainEvent } from '@pack/kernel'

import { AuthorityEvent } from '@env/event-inventory'

export interface TokenRefreshedPayload {
  userId: string
  sessionId: string
}

export class TokenRefreshedEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: TokenRefreshedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName() {
    return AuthorityEvent.TokenRefreshed
  }

  get eventVersion() {
    return 1
  }
}
