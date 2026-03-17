import { Event } from '@repo/kernel'

export interface TokenRefreshedPayload {
  userId: string
  sessionId: string
}

export class TokenRefreshedEvent extends Event<TokenRefreshedPayload> {
  get eventName() {
    return 'authority.token.refreshed'
  }

  get eventVersion() {
    return 1
  }
}
