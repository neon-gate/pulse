import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import {
  NatsConnectionToken,
  NatsEventBusAdapter,
  NoopEventBusAdapter
} from '@repo/event-bus'

import type { SlimShadyEventMap } from '@domain/events'
import { SlimShadyEventBusPort } from '@domain/ports'

export const slimShadyEventBusProvider: Provider = {
  provide: SlimShadyEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) {
      return new NoopEventBusAdapter<SlimShadyEventMap>()
    }

    return new NatsEventBusAdapter<SlimShadyEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
