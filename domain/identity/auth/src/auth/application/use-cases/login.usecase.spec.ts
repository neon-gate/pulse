import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { LoginUseCase } from '@application/use-cases/login.usecase'
import { AuthTokenService } from '@application/services/auth-token.service'
import { AuthEventBusPort, UserPort } from '@domain/ports'
import { User } from '@domain/entities'
import { AuthProvider } from '@domain/value-objects'

describe('auth/application/login.usecase', () => {
  it('returns tokens for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('Password123', 10)
    const user = User.create({
      email: 'user@pulse.local',
      passwordHash,
      provider: AuthProvider.Password,
      providerUserId: null,
      name: 'Pulse',
      createdAt: new Date()
    })

    const users: Partial<UserPort> = {
      findByEmail: jest.fn().mockResolvedValue(user)
    }
    const tokens: Partial<AuthTokenService> = {
      createSession: jest.fn().mockResolvedValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        sessionId: 'session'
      })
    }
    const events: AuthEventBusPort = {
      emit: jest.fn().mockResolvedValue(undefined),
      on: jest.fn()
    }

    const module = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: UserPort, useValue: users },
        { provide: AuthTokenService, useValue: tokens },
        { provide: AuthEventBusPort, useValue: events }
      ]
    }).compile()

    const useCase = module.get(LoginUseCase)

    const result = await useCase.execute('user@pulse.local', 'Password123', {
      ipAddress: '127.0.0.1',
      userAgent: 'jest'
    })

    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' })
    expect(tokens.createSession).toHaveBeenCalledTimes(1)
  })
})
