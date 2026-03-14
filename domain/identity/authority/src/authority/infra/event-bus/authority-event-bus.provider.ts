import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { AuthorityEventBusPort } from '@domain/ports'
import type { AuthorityEventMap } from '@domain/events'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const authorityEventBusProvider: Provider = {
  provide: AuthorityEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) {
      return new NoopEventBusAdapter<AuthorityEventMap>()
    }

    return new NatsEventBusAdapter<AuthorityEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
