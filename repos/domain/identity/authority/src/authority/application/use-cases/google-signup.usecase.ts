import { randomUUID } from 'crypto'
import { ConflictException, Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@pack/kernel'

import { User } from '@domain/entities'
import { AuthorityEventBusPort, GoogleOAuthPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email } from '@domain/value-objects'
import { UserLoggedInEvent } from '@domain/events'

import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'
import { AuthorityEvent } from '@pack/event-inventory'

interface GoogleSignupResult {
  accessToken: string
  refreshToken: string
}

interface GoogleSignupInput {
  idToken: string
  context: SessionContext
}

@Injectable()
export class GoogleSignupUseCase extends UseCase<
  GoogleSignupInput,
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

  async execute({
    idToken,
    context
  }: GoogleSignupInput): Promise<GoogleSignupResult> {
    const profile = await this.google.verifyIdToken(idToken)

    if (!profile.emailVerified) {
      throw new ConflictException('Google account email not verified')
    }

    const existing = await this.users.findByEmail(Email.create(profile.email))

    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const signedUpAt = new Date()
    const user = User.signUp(
      {
        email: profile.email,
        passwordHash: null,
        provider: AuthorityProvider.Google,
        providerUserId: profile.providerUserId,
        name: profile.name ?? null,
        profileId: null,
        createdAt: signedUpAt
      },
      undefined,
      { eventId: randomUUID(), occurredOn: signedUpAt }
    )

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    for (const event of user.pullEvents()) {
      void this.events.emit(
        event.eventName as keyof typeof AuthorityEvent,
        event.toJSON()
      )
    }

    const loggedInAt = new Date()
    const loginEvent = new UserLoggedInEvent(
      user.idString,
      {
        userId: user.idString,
        email: user.email,
        provider: user.provider,
        sessionId,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null
      },
      { eventId: randomUUID(), occurredOn: loggedInAt }
    )

    void this.events.emit(
      AuthorityEvent.UserLoggedIn,
      loginEvent.toPrimitive()
    )

    return { accessToken, refreshToken }
  }
}
