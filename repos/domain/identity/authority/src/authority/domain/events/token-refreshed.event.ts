import { Event } from '@pack/kernel'

import { AuthorityEvent } from '@env/event-inventory'
export interface TokenRefreshedPayload {
  userId: string
  sessionId: string
}

export class TokenRefreshedEvent extends Event<TokenRefreshedPayload> {
  get eventName() {
    return AuthorityEvent.TokenRefreshed
  }

  get eventVersion() {
    return 1
  }
}
