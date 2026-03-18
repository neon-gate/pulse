import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@pack/event-bus'

import { NatsConnectionToken, NoopEventBusAdapter } from '@pack/event-bus'
import type { FortMinorEventMap } from '@fort-minor/domain/events/fort-minor-event.map'
import { FortMinorEventBusPort } from '@fort-minor/application/ports/fort-minor-event-bus.port'

export const fortMinorEventBusProvider: Provider = {
  provide: FortMinorEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<FortMinorEventMap>()
    return new NatsEventBusAdapter<FortMinorEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
