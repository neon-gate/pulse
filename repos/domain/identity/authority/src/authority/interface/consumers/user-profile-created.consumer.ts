import { Injectable, Logger, OnModuleInit } from '@nestjs/common'

import { UserPort } from '@domain/ports'
import { AuthorityEventBusPort } from '@domain/ports/authority-event-bus.port'

import { UserEvent } from '@env/event-inventory'
@Injectable()
export class UserProfileCreatedConsumer implements OnModuleInit {
  private readonly logger = new Logger(UserProfileCreatedConsumer.name)

  constructor(
    private readonly users: UserPort,
    private readonly events: AuthorityEventBusPort
  ) {}

  onModuleInit(): void {
    this.events.on(UserEvent.ProfileCreated, async (payload) => {
      try {
        await this.users.updateProfileId(payload.authId, payload.profileId)
      } catch (error) {
        this.logger.error('Failed to handle user.profile.created', error)
      }
    })
  }
}
