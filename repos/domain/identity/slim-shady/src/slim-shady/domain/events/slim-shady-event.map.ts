import type { EventMap } from '@repo/kernel'

export interface SlimShadyEventMap extends EventMap {
  'authority.user.signed_up': {
    userId: string
    email: string
    provider: string
    name?: string | null
    occurredAt: string
  }
  'user.profile.created': {
    profileId: string
    authId: string
    email: string
    occurredAt: string
  }
  'user.profile.updated': {
    profileId: string
    fields: string[]
    occurredAt: string
  }
  'user.profile.deleted': {
    profileId: string
    authId: string
    occurredAt: string
  }
}
