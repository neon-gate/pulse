import { ConflictException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { User } from '@domain/entities'
import { UserPort } from '@domain/ports'
import { Email, Password } from '@domain/value-objects'
import {
  AuthFailureReason,
  AuthLogEvent,
  hashSensitiveValue,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'

interface SignupInput {
  email: string
  password: string
}

@Injectable()
export class SignupUseCase {
  constructor(private readonly users: UserPort) {}

  async execute(input: SignupInput) {
    const email = Email.create(input.email)
    const password = Password.create(input.password)
    const existing = await this.users.findByEmail(email)

    if (existing) {
      void logAxiomEvent({
        event: AuthLogEvent.AuthSignupFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthFailureReason.EmailAlreadyRegistered,
          emailHash: hashSensitiveValue(email.toString())
        }
      })
      throw new ConflictException('Email already registered')
    }

    const hash = await bcrypt.hash(password.toString(), 10)

    const user = User.create({
      email: email.toString(),
      passwordHash: hash,
      createdAt: new Date()
    })

    await this.users.create(user)

    return {
      userId: user.idString
    }
  }
}
