import { Module } from '@nestjs/common'
import {
  NatsConnectionToken,
  natsConnectionProvider,
  NatsLifecycleService
} from '@pack/event-bus'

/// Provides and exports a shared NATS connection with lifecycle management.
@Module({
  providers: [natsConnectionProvider, NatsLifecycleService],
  exports: [NatsConnectionToken]
})
export class NatsModule {}
