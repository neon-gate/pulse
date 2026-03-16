import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken, NoopEventBusAdapter } from '@repo/event-bus'
import type { PetrifiedEventMap } from '@petrified/domain/events/petrified-event.map'
import { PetrifiedEventBusPort } from '@petrified/application/ports/petrified-event-bus.port'

export const petrifiedEventBusProvider: Provider = {
  provide: PetrifiedEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<PetrifiedEventMap>()
    return new NatsEventBusAdapter<PetrifiedEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
