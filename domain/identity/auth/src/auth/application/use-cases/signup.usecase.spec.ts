import { Test } from '@nestjs/testing'

import { SignupUseCase } from '@application/use-cases/signup.usecase'
import { AuthTokenService } from '@application/services/auth-token.service'
import { AuthEventBusPort, UserPort } from '@domain/ports'
import { AuthProvider } from '@domain/value-objects'

describe('auth/application/signup.usecase', () => {
  it('creates a user and returns tokens', async () => {
    const users: Partial<UserPort> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(undefined)
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
        SignupUseCase,
        { provide: UserPort, useValue: users },
        { provide: AuthTokenService, useValue: tokens },
        { provide: AuthEventBusPort, useValue: events }
      ]
    }).compile()

    const useCase = module.get(SignupUseCase)

    const result = await useCase.execute(
      { email: 'user@pulse.local', password: 'Password123', name: 'Pulse' },
      { ipAddress: '127.0.0.1', userAgent: 'jest' }
    )

    expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' })
    expect(users.create).toHaveBeenCalledTimes(1)
    const createdUser = (users.create as jest.Mock).mock.calls[0]?.[0]
    expect(createdUser.provider).toBe(AuthProvider.Password)
    expect(tokens.createSession).toHaveBeenCalledTimes(1)
  })
})
