import type { EventMap } from '@repo/kernel'

export interface AuthorityEventMap extends EventMap {
  'authority.user.signed_up': {
    userId: string
    email: string
    provider: string
    name?: string | null
    occurredAt: string
  }
  'authority.user.logged_in': {
    userId: string
    email: string
    provider: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    occurredAt: string
  }
  'authority.token.refreshed': {
    userId: string
    sessionId: string
    occurredAt: string
  }
  'authority.user.logged_out': {
    userId: string
    sessionId: string
    occurredAt: string
  }
  'user.profile.created': {
    profileId: string
    authId: string
    email: string
    occurredAt: string
  }
}
