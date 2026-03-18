import { randomUUID } from 'crypto'
import { Inject, Injectable } from '@nestjs/common'

import { UniqueEntityId, UseCase } from '@pack/kernel'

import {
  type AudioQualityPreference,
  type ThemePreference,
  User
} from '@domain/entities'
import { UserEvent } from '@env/event-inventory'
import { SlimShadyEventBusPort, UserPort } from '@domain/ports'
import { DisplayName } from '@domain/value-objects'

interface CreateUserProfileInput {
  authId: string
  email: string
  name?: string | null
}

const defaultTheme: ThemePreference = 'dark'
const defaultAudioQuality: AudioQualityPreference = 'high'

@Injectable()
export class CreateUserProfileUseCase extends UseCase<
  [input: CreateUserProfileInput],
  void
> {
  constructor(
    private readonly users: UserPort,
    @Inject(SlimShadyEventBusPort)
    private readonly events: SlimShadyEventBusPort
  ) {
    super()
  }

  async execute(input: CreateUserProfileInput): Promise<void> {
    const existing = await this.users.findByAuthId(input.authId)
    if (existing) return

    const fallbackName = input.email.split('@')[0] ?? 'listener'
    const displayName = DisplayName.create(input.name ?? fallbackName).toString()
    const now = new Date()

    const user = User.create(
      {
        authId: input.authId,
        email: input.email.trim().toLowerCase(),
        username: null,
        profile: {
          displayName,
          avatarUrl: null,
          bio: null
        },
        preferences: {
          theme: defaultTheme,
          explicitContentFilter: false,
          audioQuality: defaultAudioQuality,
          privateSession: false
        },
        country: null,
        account: {
          status: 'active'
        },
        onboarding: {
          completed: false,
          completedAt: null
        },
        createdAt: now,
        updatedAt: now
      },
      UniqueEntityId.create(`usr_${randomUUID()}`)
    )

    await this.users.create(user)

    await this.events.emit(UserEvent.ProfileCreated, {
      profileId: user.idString,
      authId: user.authId,
      email: user.email,
      occurredAt: new Date().toISOString()
    })
  }
}
