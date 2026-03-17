import { Event } from '@repo/kernel'

export interface UserProfileDeletedPayload {
  profileId: string
  authId: string
  occurredAt: string
}

export class UserProfileDeletedEvent extends Event<UserProfileDeletedPayload> {
  get eventName(): string {
    return 'user.profile.deleted'
  }

  get eventVersion(): number {
    return 1
  }
}
