import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { SlimShadyEventBusPort, UserPort } from '@domain/ports'
import {
  type AudioQualityPreference,
  type ThemePreference
} from '@domain/entities'

interface UpdateUserPreferencesInput {
  profileId: string
  theme?: ThemePreference
  explicitContentFilter?: boolean
  audioQuality?: AudioQualityPreference
  privateSession?: boolean
}

@Injectable()
export class UpdateUserPreferencesUseCase extends UseCase<
  [input: UpdateUserPreferencesInput],
  void
> {
  constructor(
    private readonly users: UserPort,
    @Inject(SlimShadyEventBusPort)
    private readonly events: SlimShadyEventBusPort
  ) {
    super()
  }

  async execute(input: UpdateUserPreferencesInput): Promise<void> {
    const user = await this.users.findById(input.profileId)

    if (!user) {
      throw new NotFoundException('Profile not found')
    }

    const changedFields = user.updatePreferences({
      theme: input.theme,
      explicitContentFilter: input.explicitContentFilter,
      audioQuality: input.audioQuality,
      privateSession: input.privateSession
    })

    if (changedFields.length === 0) {
      return
    }

    await this.users.update(user)

    await this.events.emit('user.profile.updated', {
      profileId: user.idString,
      fields: changedFields,
      occurredAt: new Date().toISOString()
    })
  }
}
