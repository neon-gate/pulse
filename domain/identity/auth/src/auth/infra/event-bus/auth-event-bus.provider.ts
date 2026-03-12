import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { AuthEventBusPort } from '@domain/ports'
import type { AuthEventMap } from '@domain/events'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken } from './nats-connection.provider'

export const authEventBusProvider: Provider = {
  provide: AuthEventBusPort,
  useFactory: (connection: NatsConnection) =>
    new NatsEventBusAdapter<AuthEventMap>(connection),
  inject: [NatsConnectionToken]
}
