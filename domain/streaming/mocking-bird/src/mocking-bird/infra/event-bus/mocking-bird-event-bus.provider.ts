import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { MockingbirdEventBusPort } from '@domain/ports'
import type { MockingbirdEventMap } from '@domain/events'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken } from './nats-connection.provider'

export const mockingbirdEventBusProvider: Provider = {
  provide: MockingbirdEventBusPort,
  useFactory: (connection: NatsConnection) =>
    new NatsEventBusAdapter<MockingbirdEventMap>(connection),
  inject: [NatsConnectionToken]
}
