import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { NoopEventBusAdapter } from '@core/infra/nats/noop-event-bus.adapter'
import type { ReasoningEventMap } from '@reasoning/domain/events/reasoning-event.map'
import { ReasoningEventBusPort } from '@reasoning/application/ports/reasoning-event-bus.port'

export const reasoningEventBusProvider: Provider = {
  provide: ReasoningEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<ReasoningEventMap>()
    return new NatsEventBusAdapter<ReasoningEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
