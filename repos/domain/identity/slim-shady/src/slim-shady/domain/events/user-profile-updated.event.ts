import { DomainEvent } from '@pack/kernel'

import { UserEvent } from '@env/event-inventory'

export interface UserProfileUpdatedPayload {
  profileId: string
  fields: string[]
}

export class UserProfileUpdatedEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserProfileUpdatedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName(): string {
    return UserEvent.ProfileUpdated
  }

  get eventVersion(): number {
    return 1
  }
}
