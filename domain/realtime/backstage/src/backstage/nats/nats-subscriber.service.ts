import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common'
import { connect, StringCodec, type NatsConnection, type Subscription } from 'nats'

import { TrackGateway } from '../events/track.gateway'

const sc = StringCodec()

/// Subscribes to all `track.>` subjects on NATS and forwards each message
/// to the WebSocket broadcast layer via TrackGateway.
@Injectable()
export class NatsSubscriberService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private connection: NatsConnection | null = null
  private subscription: Subscription | null = null

  constructor(private readonly gateway: TrackGateway) {}

  async onApplicationBootstrap(): Promise<void> {
    const servers = process.env.NATS_URL
    if (!servers) {
      console.warn('[Backstage] NATS_URL not set — running without event subscription')
      return
    }

    try {
      this.connection = await connect({ servers })
      console.log('[Backstage] Connected to NATS')

      this.subscription = this.connection.subscribe('track.>')
      console.log('[Backstage] Subscribed to track.>')

      void this.consumeLoop()
    } catch (error) {
      console.error('[Backstage] Failed to connect to NATS:', error)
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.subscription?.unsubscribe()
    if (this.connection) {
      await this.connection.drain()
    }
  }

  private async consumeLoop(): Promise<void> {
    if (!this.subscription) return

    for await (const msg of this.subscription) {
      try {
        const subject = msg.subject
        const payload = JSON.parse(sc.decode(msg.data)) as unknown
        console.log(`[Backstage] Forwarding ${subject}`)
        this.gateway.broadcast(subject, payload)
      } catch {
        // Malformed message — skip and continue.
      }
    }
  }
}
