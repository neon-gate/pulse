import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { AuthEventBusPort, GoogleOAuthPort, UserPort } from '@domain/ports'
import { AuthProvider, Email } from '@domain/value-objects'
import {
  AuthFailureReason,
  AuthLogEvent,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import {
  AuthTokenService,
  type SessionContext
} from '@application/services/auth-token.service'

interface GoogleLoginResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class GoogleLoginUseCase extends UseCase<
  [idToken: string, context: SessionContext],
  GoogleLoginResult
> {
  constructor(
    private readonly users: UserPort,
    private readonly tokens: AuthTokenService,
    private readonly google: GoogleOAuthPort,
    @Inject(AuthEventBusPort)
    private readonly events: AuthEventBusPort
  ) {
    super()
  }

  async execute(
    idToken: string,
    context: SessionContext
  ): Promise<GoogleLoginResult> {
    const profile = await this.google.verifyIdToken(idToken)

    if (!profile.emailVerified) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthGoogleLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.EmailNotVerified,
          email: profile.email
        }
      })
      throw new UnauthorizedException('Google account email not verified')
    }

    const existing = await this.users.findByEmail(Email.create(profile.email))

    if (!existing) {
      throw new UnauthorizedException('No account associated with this Google login')
    }

    if (existing.provider !== AuthProvider.Google) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthGoogleLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.ProviderMismatch,
          userId: existing.idString
        }
      })
      throw new ConflictException('Use email and password to sign in')
    }

    if (
      existing.providerUserId &&
      existing.providerUserId !== profile.providerUserId
    ) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthGoogleLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.ProviderMismatch,
          userId: existing.idString
        }
      })
      throw new UnauthorizedException('Google account mismatch')
    }

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(existing, context)

    void this.events
      .emit('auth.user.logged_in', {
        userId: existing.idString,
        email: existing.email,
        provider: existing.provider,
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
