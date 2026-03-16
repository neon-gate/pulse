import { Session } from '@domain'

export const sessionMock = {
  jwtToken: '5915c581-003f-4f25-becd-57a56be7796e',
  refreshToken: '86e2e1b1-6942-4a89-b541-267fe18a5756',
  expiresAt: new Date(Date.now() + 1_000_000_000)
} satisfies Session
