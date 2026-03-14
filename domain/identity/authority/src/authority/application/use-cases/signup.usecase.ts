import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UseCase } from '@repo/kernel'

import { User } from '@domain/entities'
import { AuthorityEventBusPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email, Password } from '@domain/value-objects'

import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'

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

    const user = User.create({
      email: email.toString(),
      passwordHash: hash,
      provider: AuthorityProvider.Password,
      providerUserId: null,
      name: input.name ?? null,
      createdAt: new Date()
    })

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    void this.events.emit('authority.user.signed_up', {
      userId: user.idString,
      email: user.email,
      provider: user.provider,
      name: user.name,
      occurredAt: new Date().toISOString()
    })

    void this.events.emit('authority.user.logged_in', {
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
