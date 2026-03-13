import type { Provider } from '@nestjs/common'
import { connect, type NatsConnection } from 'nats'

export const NatsConnectionToken = Symbol('NATS_CONNECTION')

export const natsConnectionProvider: Provider = {
  provide: NatsConnectionToken,
  useFactory: async (): Promise<NatsConnection | null> => {
    const servers = process.env.NATS_URL
    if (!servers) return null
    return connect({ servers })
  }
}
