import { Module } from '@nestjs/common'

import {
  NatsConnectionToken,
  natsConnectionProvider
} from './nats-connection.provider'
import { NatsLifecycleService } from './nats-lifecycle.service'

/// Provides and exports a shared NATS connection with lifecycle management.
@Module({
  providers: [natsConnectionProvider, NatsLifecycleService],
  exports: [NatsConnectionToken]
})
export class NatsModule {}
