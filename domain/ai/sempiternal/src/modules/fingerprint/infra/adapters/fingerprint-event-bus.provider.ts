import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { NoopEventBusAdapter } from '@core/infra/nats/noop-event-bus.adapter'
import type { FingerprintEventMap } from '@fingerprint/domain/events/fingerprint-event.map'
import { FingerprintEventBusPort } from '@fingerprint/application/ports/fingerprint-event-bus.port'

export const fingerprintEventBusProvider: Provider = {
  provide: FingerprintEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<FingerprintEventMap>()
    return new NatsEventBusAdapter<FingerprintEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
