import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from './nats-connection.provider'

@Injectable()
export class NatsLifecycleService implements OnModuleDestroy {
  constructor(
    @Inject(NatsConnectionToken)
    private readonly connection: NatsConnection | null
  ) {}

  async onModuleDestroy(): Promise<void> {
    if (!this.connection) {
      return
    }

    await this.connection.drain()
  }
}
