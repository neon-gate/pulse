import { DomainEvent } from '@pack/kernel'

import { UserEvent } from '@env/event-inventory'

export interface UserProfileCreatedPayload {
  profileId: string
  authId: string
  email: string
}

export class UserProfileCreatedEvent extends DomainEvent<Map<string, unknown>> {
  constructor(
    aggregateId: string,
    props: UserProfileCreatedPayload,
    meta: { eventId: string; occurredOn: Date }
  ) {
    super(aggregateId, new Map(Object.entries(props)), meta)
  }

  get eventName(): string {
    return UserEvent.ProfileCreated
  }

  get eventVersion(): number {
    return 1
  }
}
