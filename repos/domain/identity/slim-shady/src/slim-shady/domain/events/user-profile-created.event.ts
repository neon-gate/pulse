import { Event } from '@repo/kernel'

export interface UserProfileCreatedPayload {
  profileId: string
  authId: string
  email: string
  occurredAt: string
}

export class UserProfileCreatedEvent extends Event<UserProfileCreatedPayload> {
  get eventName(): string {
    return 'user.profile.created'
  }

  get eventVersion(): number {
    return 1
  }
}
