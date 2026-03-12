import { DomainEvent } from '@repo/kernel'

export interface UserLoggedOutPayload {
  userId: string
  sessionId: string
}

export class UserLoggedOutEvent extends DomainEvent<UserLoggedOutPayload> {
  get eventName() {
    return 'auth.user.logged_out'
  }

  get eventVersion() {
    return 1
  }
}
