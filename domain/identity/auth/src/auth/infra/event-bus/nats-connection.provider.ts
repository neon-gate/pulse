import type { Provider } from '@nestjs/common'
import { connect, type NatsConnection } from 'nats'

import { requireStringEnv } from '@infra/env'

import { EventBusConfigFlag } from './event-bus-config-flag.enum'

export const NatsConnectionToken = Symbol('NATS_CONNECTION')

export const natsConnectionProvider: Provider = {
  provide: NatsConnectionToken,
  useFactory: async (): Promise<NatsConnection> => {
    const servers = requireStringEnv(EventBusConfigFlag.NatsUrl)
    return connect({ servers })
  }
}
