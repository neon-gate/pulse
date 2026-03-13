import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'

import { NatsEventBusAdapter } from '@repo/event-bus'

import { FingerprintEventBusPort } from '@domain/ports'
import type { FingerprintEventMap } from '@domain/events'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const fingerprintEventBusProvider: Provider = {
  provide: FingerprintEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<FingerprintEventMap>()
    return new NatsEventBusAdapter<FingerprintEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
