import { randomUUID } from 'crypto'
import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UseCase } from '@pack/kernel'

import { User } from '@domain/entities'
import { AuthorityEventBusPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email, Password } from '@domain/value-objects'
import { UserLoggedInEvent } from '@domain/events'

import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'
import { AuthorityEvent } from '@env/event-inventory'

interface SignupInput {
  email: string
  password: string
  name?: string | null
}

interface SignupResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class SignupUseCase extends UseCase<
  [input: SignupInput, context: SessionContext],
  SignupResult
> {
  constructor(
    private readonly users: UserPort,
    private readonly tokens: AuthorityTokenService,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
  ) {
    super()
  }

  async execute(
    input: SignupInput,
    context: SessionContext
  ): Promise<SignupResult> {
    const email = Email.create(input.email)
    const password = Password.create(input.password)
    const existing = await this.users.findByEmail(email)

    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const hash = await bcrypt.hash(password.toString(), 10)

    const now = new Date()
    const user = User.signUp(
      {
        email: email.toString(),
        passwordHash: hash,
        provider: AuthorityProvider.Password,
        providerUserId: null,
        name: input.name ?? null,
        profileId: null,
        createdAt: now
      },
      undefined,
      { eventId: randomUUID(), occurredOn: now }
    )

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    for (const event of user.pullEvents()) {
      void this.events.emit(
        event.eventName as keyof typeof AuthorityEvent,
        event.toPrimitive()
      )
    }

    const now = new Date()
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
      { eventId: randomUUID(), occurredOn: now }
    )

    void this.events.emit(
      AuthorityEvent.UserLoggedIn,
      loginEvent.toPrimitive()
    )

    return { accessToken, refreshToken }
  }
}
