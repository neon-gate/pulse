import type { EventMap } from '@pack/kernel'

import { AuthorityEvent, UserEvent } from '@env/event-inventory'
export interface AuthorityEventMap extends EventMap {
  [AuthorityEvent.UserSignedUp]: {
    userId: string
    email: string
    provider: string
    name?: string | null
    occurredAt: string
  }
  [AuthorityEvent.UserLoggedIn]: {
    userId: string
    email: string
    provider: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    occurredAt: string
  }
  [AuthorityEvent.TokenRefreshed]: {
    userId: string
    sessionId: string
    occurredAt: string
  }
  [AuthorityEvent.UserLoggedOut]: {
    userId: string
    sessionId: string
    occurredAt: string
  }
  [UserEvent.ProfileCreated]: {
    profileId: string
    authId: string
    email: string
    occurredAt: string
  }
}
