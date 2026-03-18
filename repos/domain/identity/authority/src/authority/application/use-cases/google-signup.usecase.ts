import { ConflictException, Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@pack/kernel'

import { User } from '@domain/entities'
import { AuthorityEventBusPort, GoogleOAuthPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email } from '@domain/value-objects'

import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'
import { AuthorityEvent } from '@env/event-inventory'

interface GoogleSignupResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class GoogleSignupUseCase extends UseCase<
  [idToken: string, context: SessionContext],
  GoogleSignupResult
> {
  constructor(
    private readonly users: UserPort,
    private readonly tokens: AuthorityTokenService,
    private readonly google: GoogleOAuthPort,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
  ) {
    super()
  }

  async execute(
    idToken: string,
    context: SessionContext
  ): Promise<GoogleSignupResult> {
    const profile = await this.google.verifyIdToken(idToken)

    if (!profile.emailVerified) {
      throw new ConflictException('Google account email not verified')
    }

    const existing = await this.users.findByEmail(Email.create(profile.email))

    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const user = User.create({
      email: profile.email,
      passwordHash: null,
      provider: AuthorityProvider.Google,
      providerUserId: profile.providerUserId,
      name: profile.name ?? null,
      profileId: null,
      createdAt: new Date()
    })

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    void this.events.emit(AuthorityEvent.UserSignedUp, {
      userId: user.idString,
      email: user.email,
      provider: user.provider,
      name: user.name,
      occurredAt: new Date().toISOString()
    })

    void this.events.emit(AuthorityEvent.UserLoggedIn, {
      userId: user.idString,
      email: user.email,
      provider: user.provider,
      sessionId,
      ipAddress: context.ipAddress ?? null,
      userAgent: context.userAgent ?? null,
      occurredAt: new Date().toISOString()
    })

    return { accessToken, refreshToken }
  }
}
