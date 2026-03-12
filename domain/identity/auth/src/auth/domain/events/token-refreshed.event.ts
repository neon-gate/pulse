import { DomainEvent } from '@repo/kernel'

export interface TokenRefreshedPayload {
  userId: string
  sessionId: string
}

export class TokenRefreshedEvent extends DomainEvent<TokenRefreshedPayload> {
  get eventName() {
    return 'auth.token.refreshed'
  }

  get eventVersion() {
    return 1
  }
}
