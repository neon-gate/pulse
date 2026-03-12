import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { NatsConnectionToken } from './nats-connection.provider'

@Injectable()
export class NatsLifecycleService implements OnModuleDestroy {
  constructor(
    @Inject(NatsConnectionToken) private readonly connection: NatsConnection
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.connection.drain()
  }
}
