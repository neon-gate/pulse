import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'

import { RefreshTokenPort, UserPort } from '@domain/ports'
import { Email, Password } from '@domain/value-objects'
import {
  AuthFailureReason,
  AuthLogEvent,
  hashSensitiveValue,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'

@Injectable()
export class LoginUseCase {
  private readonly refreshSecret = requireStringEnv(
    DbConfigFlag.JwtRefreshSecret
  )
  private readonly refreshExpiresIn = requireStringEnv(
    DbConfigFlag.JwtRefreshExpiresIn
  ) as never

  constructor(
    private readonly users: UserPort,
    private readonly refreshTokens: RefreshTokenPort,
    private readonly jwt: JwtService
  ) {}

  async execute(email: string, password: string) {
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

    const payload = { sub: user.idString, email: user.email }

    const accessToken = await this.jwt.signAsync(payload)
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn
    })
    const refreshTokenHash = await hash(refreshToken, 10)
    const decoded = this.jwt.decode(refreshToken) as { exp?: number } | null

    if (!decoded?.exp) {
      throw new UnauthorizedException('Invalid refresh token payload')
    }

    await this.refreshTokens.upsertForUser({
      userId: user.idString,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(decoded.exp * 1000)
    })

    return { accessToken, refreshToken }
  }
}
