import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { ReasoningEventBusPort } from '@domain/ports'
import type { ReasoningEventMap } from '@domain/events'

import { NoopEventBusAdapter } from './noop-event-bus.adapter'
import { NatsConnectionToken } from './nats-connection.provider'

export const reasoningEventBusProvider: Provider = {
  provide: ReasoningEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<ReasoningEventMap>()
    return new NatsEventBusAdapter<ReasoningEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
