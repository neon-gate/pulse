import { DomainEvent } from '@repo/kernel'
import type { AuthProvider } from '@domain/value-objects'

export interface UserSignedUpPayload {
  userId: string
  email: string
  provider: AuthProvider
  name?: string | null
}

export class UserSignedUpEvent extends DomainEvent<UserSignedUpPayload> {
  get eventName() {
    return 'auth.user.signed_up'
  }

  get eventVersion() {
    return 1
  }
}
