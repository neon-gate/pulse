import { Event } from '@repo/kernel'

export interface UserLoggedOutPayload {
  userId: string
  sessionId: string
}

export class UserLoggedOutEvent extends Event<UserLoggedOutPayload> {
  get eventName() {
    return 'authority.user.logged_out'
  }

  get eventVersion() {
    return 1
  }
}
