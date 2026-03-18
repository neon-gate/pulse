import { Event } from '@pack/kernel'

import { AuthorityEvent } from '@env/event-inventory'
export interface UserLoggedOutPayload {
  userId: string
  sessionId: string
}

export class UserLoggedOutEvent extends Event<UserLoggedOutPayload> {
  get eventName() {
    return AuthorityEvent.UserLoggedOut
  }

  get eventVersion() {
    return 1
  }
}
