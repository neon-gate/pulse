import type { Provider } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { NatsEventBusAdapter } from '@repo/event-bus'

import { NatsConnectionToken } from '@core/infra/nats/nats-connection.provider'
import { NoopEventBusAdapter } from '@core/infra/nats/noop-event-bus.adapter'
import type { TranscriptionEventMap } from '@transcription/domain/events/transcription-event.map'
import { TranscriptionEventBusPort } from '@transcription/application/ports/transcription-event-bus.port'

export const transcriptionEventBusProvider: Provider = {
  provide: TranscriptionEventBusPort,
  useFactory: (connection: NatsConnection | null) => {
    if (!connection) return new NoopEventBusAdapter<TranscriptionEventMap>()
    return new NatsEventBusAdapter<TranscriptionEventMap>(connection)
  },
  inject: [NatsConnectionToken]
}
