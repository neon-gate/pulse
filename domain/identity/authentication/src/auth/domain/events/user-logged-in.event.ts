import { DomainEvent } from '@repo/kernel'
import type { AuthProvider } from '@domain/value-objects'

export interface UserLoggedInPayload {
  userId: string
  email: string
  provider: AuthProvider
  sessionId: string
  ipAddress?: string | null
  userAgent?: string | null
}

export class UserLoggedInEvent extends DomainEvent<UserLoggedInPayload> {
  get eventName() {
    return 'auth.user.logged_in'
  }

  get eventVersion() {
    return 1
  }
}
