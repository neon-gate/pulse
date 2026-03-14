import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { TranscriptionEventBusPort } from '@domain/ports'
import type { TranscriptionEventMap } from '@domain/events'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const transcriptionEventBusProvider: Provider = {
  provide: TranscriptionEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<TranscriptionEventMap>()
    return new NatsEventBusAdapter<TranscriptionEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
