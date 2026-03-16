import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { SlimShadyEventBusPort, UserPort } from '@domain/ports'

interface CompleteOnboardingInput {
  profileId: string
  completed: boolean
}

@Injectable()
export class CompleteOnboardingUseCase extends UseCase<
  [input: CompleteOnboardingInput],
  void
> {
  constructor(
    private readonly users: UserPort,
    @Inject(SlimShadyEventBusPort)
    private readonly events: SlimShadyEventBusPort
  ) {
    super()
  }

  async execute(input: CompleteOnboardingInput): Promise<void> {
    const user = await this.users.findById(input.profileId)

    if (!user) {
      throw new NotFoundException('Profile not found')
    }

    const changedFields = user.completeOnboarding(input.completed)

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
