import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { FortMinorEventBusPort } from '@domain/ports'
import type { FortMinorEventMap } from '@domain/events'
import { NatsEventBusAdapter } from '@repo/event-bus-nats'

import { NatsConnectionToken } from './nats-connection.provider'

export const fortMinorEventBusProvider: Provider = {
  provide: FortMinorEventBusPort,
  useFactory: (connection: NatsConnection) =>
    new NatsEventBusAdapter<FortMinorEventMap>(connection),
  inject: [NatsConnectionToken]
}
