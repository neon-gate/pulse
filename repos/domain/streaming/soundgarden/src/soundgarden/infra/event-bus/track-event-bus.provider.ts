import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import {
  NatsEventBusAdapter,
  NoopEventBusAdapter,
  NatsConnectionToken
} from '@repo/event-bus'

import { TrackEventBusPort } from '@domain/ports'
import type { TrackEventMap } from '@domain/events'

export const trackEventBusProvider: Provider = {
  provide: TrackEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) {
      return new NoopEventBusAdapter<TrackEventMap>()
    }

    return new NatsEventBusAdapter<TrackEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
