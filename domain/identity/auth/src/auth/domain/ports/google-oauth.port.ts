import { AuthProvider } from '@domain/value-objects'

export interface GoogleProfile {
  provider: AuthProvider.Google
  providerUserId: string
  email: string
  name?: string | null
  emailVerified: boolean
}

export abstract class GoogleOAuthPort {
  abstract verifyIdToken(idToken: string): Promise<GoogleProfile>
}
