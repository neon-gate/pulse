import { Event } from '@repo/kernel'
import type { AuthorityProvider } from '@domain/value-objects'

export interface UserSignedUpPayload {
  userId: string
  email: string
  provider: AuthorityProvider
  name?: string | null
}

export class UserSignedUpEvent extends Event<UserSignedUpPayload> {
  get eventName() {
    return 'authority.user.signed_up'
  }

  get eventVersion() {
    return 1
  }
}
