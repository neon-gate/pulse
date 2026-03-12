import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
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
import type { TokenPayload } from '@application/services/auth-token.service'

interface LogoutResult {
  success: boolean
}

@Injectable()
export class LogoutUseCase extends UseCase<[refreshToken: string], LogoutResult> {
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
    @Inject(AuthEventBusPort)
    private readonly events: AuthEventBusPort
  ) {
    super()
  }

  async execute(refreshToken: string): Promise<LogoutResult> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.refreshSecret
      })
      const parsedPayload = this.payloadSchema.safeParse(payload)
      if (!parsedPayload.success) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      const typedPayload = parsedPayload.data

      await this.sessions.deleteById(typedPayload.sid)

      void this.events
        .emit('auth.user.logged_out', {
          userId: typedPayload.sub,
          sessionId: typedPayload.sid,
          occurredAt: new Date().toISOString()
        })
        .catch((error) => {
          void logAxiomEvent({
            event: AuthLogEvent.AuthEventPublishFailed,
            level: LogLevel.Warn,
            context: {
              event: 'auth.user.logged_out',
              errorName: error instanceof Error ? error.name : 'unknown'
            }
          })
        })

      return { success: true }
    } catch (error) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthLogoutFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.InvalidRefreshToken,
          errorName: error instanceof Error ? error.name : 'unknown'
        }
      })
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
