import { Event } from '@repo/kernel'
import type { AuthorityProvider } from '@domain/value-objects'

export interface UserLoggedInPayload {
  userId: string
  email: string
  provider: AuthorityProvider
  sessionId: string
  ipAddress?: string | null
  userAgent?: string | null
}

export class UserLoggedInEvent extends Event<UserLoggedInPayload> {
  get eventName() {
    return 'authority.user.logged_in'
  }

  get eventVersion() {
    return 1
  }
}
