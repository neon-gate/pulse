import { Event } from '@pack/kernel'

import { UserEvents } from '@env/event-inventory'
export interface UserProfileCreatedPayload {
  profileId: string
  authId: string
  email: string
  occurredAt: string
}

export class UserProfileCreatedEvent extends Event<UserProfileCreatedPayload> {
  get eventName(): string {
    return UserEvents.ProfileCreated
  }

  get eventVersion(): number {
    return 1
  }
}
