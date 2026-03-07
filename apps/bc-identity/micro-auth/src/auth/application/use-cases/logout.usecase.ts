import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { RefreshTokenPort } from '@domain/ports'
import {
  AuthFailureReason,
  AuthLogEvent,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'

@Injectable()
export class LogoutUseCase {
  private readonly refreshSecret = requireStringEnv(
    DbConfigFlag.JwtRefreshSecret
  )

  constructor(
    private readonly refreshTokens: RefreshTokenPort,
    private readonly jwt: JwtService
  ) {}

  async execute(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.refreshSecret
      })

      await this.refreshTokens.deleteByUserId(payload.sub)

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
