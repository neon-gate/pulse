import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

import { UseCase } from '@repo/kernel'

import { AuthorityEventBusPort, SessionPort } from '@domain/ports'
import { AuthorityProvider } from '@domain/value-objects'

import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'
import type { TokenPayload } from '@application/services/authority-token.service'

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
      provider: z.nativeEnum(AuthorityProvider)
    })
    .strict()

  constructor(
    private readonly sessions: SessionPort,
    private readonly jwt: JwtService,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
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

      void this.events.emit('authority.user.logged_out', {
        userId: typedPayload.sub,
        sessionId: typedPayload.sid,
        occurredAt: new Date().toISOString()
      })

      return { success: true }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
