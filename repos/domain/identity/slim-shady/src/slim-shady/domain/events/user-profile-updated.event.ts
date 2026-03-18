import { Event } from '@pack/kernel'

import { UserEvent } from '@env/event-inventory'
export interface UserProfileUpdatedPayload {
  profileId: string
  fields: string[]
  occurredAt: string
}

export class UserProfileUpdatedEvent extends Event<UserProfileUpdatedPayload> {
  get eventName(): string {
    return UserEvent.ProfileUpdated
  }

  get eventVersion(): number {
    return 1
  }
}
