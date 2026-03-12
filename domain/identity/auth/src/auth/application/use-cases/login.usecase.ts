import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcrypt'

import { UseCase } from '@repo/kernel'

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

interface LoginResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class LoginUseCase extends UseCase<
  [email: string, password: string, context: SessionContext],
  LoginResult
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
    email: string,
    password: string,
    context: SessionContext
  ): Promise<LoginResult> {
    const emailVo = Email.create(email)
    const passwordVo = Password.create(password)
    const user = await this.users.findByEmail(emailVo)

    if (!user) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.UserNotFound,
          emailHash: hashSensitiveValue(emailVo.toString())
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.provider !== AuthProvider.Password || !user.hasPassword) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.ProviderMismatch,
          userId: user.idString
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    const ok = await compare(passwordVo.toString(), user.passwordHash)

    if (!ok) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.PasswordMismatch,
          userId: user.idString,
          emailHash: hashSensitiveValue(user.email)
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

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
