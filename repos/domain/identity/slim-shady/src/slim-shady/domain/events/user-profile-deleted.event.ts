import { DomainEvent } from '@pack/kernel'

import { UserEvent } from '@env/event-inventory'

export interface UserProfileDeletedPayload {
  profileId: string
  authId: string
}

export class UserProfileDeletedEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserProfileDeletedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName(): string {
    return UserEvent.ProfileDeleted
  }

  get eventVersion(): number {
    return 1
  }
}
