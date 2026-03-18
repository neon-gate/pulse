import { Event } from '@pack/kernel'
import type { AuthorityProvider } from '@domain/value-objects'

import { AuthorityEvent } from '@env/event-inventory'
export interface UserSignedUpPayload {
  userId: string
  email: string
  provider: AuthorityProvider
  name?: string | null
}

export class UserSignedUpEvent extends Event<UserSignedUpPayload> {
  get eventName() {
    return AuthorityEvent.UserSignedUp
  }

  get eventVersion() {
    return 1
  }
}
