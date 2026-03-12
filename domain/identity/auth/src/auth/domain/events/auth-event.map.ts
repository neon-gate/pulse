import type { EventMap } from '@repo/event-bus'

export interface AuthEventMap extends EventMap {
  'auth.user.signed_up': {
    userId: string
    email: string
    provider: string
    name?: string | null
    occurredAt: string
  }
  'auth.user.logged_in': {
    userId: string
    email: string
    provider: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    occurredAt: string
  }
  'auth.token.refreshed': {
    userId: string
    sessionId: string
    occurredAt: string
  }
  'auth.user.logged_out': {
    userId: string
    sessionId: string
    occurredAt: string
  }
}
