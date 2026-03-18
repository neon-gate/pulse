import type { EventMap } from '@pack/kernel'

import { AuthorityEvent, UserEvent } from '@env/event-inventory'
export interface SlimShadyEventMap extends EventMap {
  [AuthorityEvent.UserSignedUp]: {
    userId: string
    email: string
    provider: string
    name?: string | null
    occurredAt: string
  }
  [UserEvent.ProfileCreated]: {
    profileId: string
    authId: string
    email: string
    occurredAt: string
  }
  [UserEvent.ProfileUpdated]: {
    profileId: string
    fields: string[]
    occurredAt: string
  }
  [UserEvent.ProfileDeleted]: {
    profileId: string
    authId: string
    occurredAt: string
  }
}
