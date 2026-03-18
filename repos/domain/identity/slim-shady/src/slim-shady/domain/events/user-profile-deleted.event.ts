import { Event } from '@pack/kernel'

import { UserEvent } from '@env/event-inventory'
export interface UserProfileDeletedPayload {
  profileId: string
  authId: string
  occurredAt: string
}

export class UserProfileDeletedEvent extends Event<UserProfileDeletedPayload> {
  get eventName(): string {
    return UserEvent.ProfileDeleted
  }

  get eventVersion(): number {
    return 1
  }
}
