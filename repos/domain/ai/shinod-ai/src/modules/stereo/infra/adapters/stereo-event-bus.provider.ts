import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@pack/event-bus'

import { NatsConnectionToken, NoopEventBusAdapter } from '@pack/event-bus'
import type { StereoEventMap } from '@stereo/domain/events/stereo-event.map'
import { StereoEventBusPort } from '@stereo/application/ports/stereo-event-bus.port'

export const stereoEventBusProvider: Provider = {
  provide: StereoEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<StereoEventMap>()
    return new NatsEventBusAdapter<StereoEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
