import { Event } from '@repo/kernel'

export interface UserProfileUpdatedPayload {
  profileId: string
  fields: string[]
  occurredAt: string
}

export class UserProfileUpdatedEvent extends Event<UserProfileUpdatedPayload> {
  get eventName(): string {
    return 'user.profile.updated'
  }

  get eventVersion(): number {
    return 1
  }
}
