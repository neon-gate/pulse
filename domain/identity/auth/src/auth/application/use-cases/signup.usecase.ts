import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UseCase } from '@repo/kernel'

import { User } from '@domain/entities'
import { AuthEventBusPort, UserPort } from '@domain/ports'
import { AuthProvider, Email, Password } from '@domain/value-objects'
import {
  AuthFailureReason,
  AuthLogEvent,
  hashSensitiveValue,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import {
  AuthTokenService,
  type SessionContext
} from '@application/services/auth-token.service'

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
    private readonly tokens: AuthTokenService,
    @Inject(AuthEventBusPort)
    private readonly events: AuthEventBusPort
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
      void logAxiomEvent({
        event: AuthLogEvent.AuthSignupFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.EmailAlreadyRegistered,
          emailHash: hashSensitiveValue(email.toString())
        }
      })
      throw new ConflictException('Email already registered')
    }

    const hash = await bcrypt.hash(password.toString(), 10)

    const user = User.create({
      email: email.toString(),
      passwordHash: hash,
      provider: AuthProvider.Password,
      providerUserId: null,
      name: input.name ?? null,
      createdAt: new Date()
    })

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    void this.events
      .emit('auth.user.signed_up', {
        userId: user.idString,
        email: user.email,
        provider: user.provider,
        name: user.name,
        occurredAt: new Date().toISOString()
      })
      .catch((error) => {
        void logAxiomEvent({
          event: AuthLogEvent.AuthEventPublishFailed,
          level: LogLevel.Warn,
          context: {
            event: 'auth.user.signed_up',
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      })

    void this.events
      .emit('auth.user.logged_in', {
        userId: user.idString,
        email: user.email,
        provider: user.provider,
        sessionId,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
        occurredAt: new Date().toISOString()
      })
      .catch((error) => {
        void logAxiomEvent({
          event: AuthLogEvent.AuthEventPublishFailed,
          level: LogLevel.Warn,
          context: {
            event: 'auth.user.logged_in',
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      })

    return { accessToken, refreshToken }
  }
}
