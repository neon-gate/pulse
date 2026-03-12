import { Injectable, UnauthorizedException } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { UserPort } from '@domain/ports'
import { UserId } from '@domain/value-objects'

interface MeResult {
  id: string
  email: string
  name: string | null
  provider: string
  createdAt: Date
}

@Injectable()
export class MeUseCase extends UseCase<
  [userId: string],
  MeResult
> {
  constructor(private readonly users: UserPort) {
    super()
  }

  async execute(userId: string): Promise<MeResult> {
    const id = UserId.create(userId)
    const user = await this.users.findById(id.toString())

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return {
      id: user.idString,
      email: user.email,
      name: user.name,
      provider: user.provider,
      createdAt: user.createdAt
    }
  }
}
