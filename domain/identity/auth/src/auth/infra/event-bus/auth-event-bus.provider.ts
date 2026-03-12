import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { AuthEventBusPort } from '@domain/ports'
import type { AuthEventMap } from '@domain/events'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const authEventBusProvider: Provider = {
  provide: AuthEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) {
      return new NoopEventBusAdapter<AuthEventMap>()
    }

    return new NatsEventBusAdapter<AuthEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
