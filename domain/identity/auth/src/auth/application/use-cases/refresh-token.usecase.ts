import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { z } from 'zod'

import { UseCase } from '@repo/kernel'

import { AuthEventBusPort, SessionPort } from '@domain/ports'
import { AuthProvider } from '@domain/value-objects'
import {
  AuthFailureReason,
  AuthLogEvent,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'
import {
  AuthTokenService,
  type TokenPayload
} from '@application/services/auth-token.service'

interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase extends UseCase<
  [refreshToken: string],
  RefreshTokenResult
> {
  private readonly refreshSecret = requireStringEnv(
    DbConfigFlag.JwtRefreshSecret
  )
  private readonly payloadSchema = z
    .object({
      sub: z.string().min(1),
      email: z.string().email(),
      sid: z.string().min(1),
      provider: z.nativeEnum(AuthProvider)
    })
    .strict()

  constructor(
    private readonly sessions: SessionPort,
    private readonly jwt: JwtService,
    private readonly tokens: AuthTokenService,
    @Inject(AuthEventBusPort)
    private readonly events: AuthEventBusPort
  ) {
    super()
  }

  async execute(refreshToken: string): Promise<RefreshTokenResult> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.refreshSecret
      })
      const parsedPayload = this.payloadSchema.safeParse(payload)
      if (!parsedPayload.success) {
        throw new UnauthorizedException('Refresh token is invalid')
      }
      const typedPayload = parsedPayload.data
      const session = await this.sessions.findById(typedPayload.sid)

      if (!session) {
        void logAxiomEvent({
          event: AuthLogEvent.AuthRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthFailureReason.TokenNotFound,
            userId: typedPayload.sub,
            sessionId: typedPayload.sid
          }
        })
        throw new UnauthorizedException('Refresh token is invalid')
      }

      if (session.userId !== typedPayload.sub) {
        throw new UnauthorizedException('Refresh token is invalid')
      }

      if (session.expiresAt.getTime() <= Date.now()) {
        await this.sessions.deleteById(session.idString)
        throw new UnauthorizedException('Refresh token expired')
      }

      const validHash = await compare(refreshToken, session.refreshTokenHash)
      if (!validHash) {
        void logAxiomEvent({
          event: AuthLogEvent.AuthRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthFailureReason.TokenHashMismatch,
            userId: typedPayload.sub,
            sessionId: typedPayload.sid
          }
        })
        throw new UnauthorizedException('Refresh token is invalid')
      }

      const { accessToken, refreshToken: rotatedRefreshToken } =
        await this.tokens.rotateSession(typedPayload, session)

      void this.events
        .emit('auth.token.refreshed', {
          userId: typedPayload.sub,
          sessionId: typedPayload.sid,
          occurredAt: new Date().toISOString()
        })
        .catch((error) => {
          void logAxiomEvent({
            event: AuthLogEvent.AuthEventPublishFailed,
            level: LogLevel.Warn,
            context: {
              event: 'auth.token.refreshed',
              errorName: error instanceof Error ? error.name : 'unknown'
            }
          })
        })

      return { accessToken, refreshToken: rotatedRefreshToken }
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        void logAxiomEvent({
          event: AuthLogEvent.AuthRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthFailureReason.TokenVerificationFailed,
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      }
      throw new UnauthorizedException()
    }
  }
}
