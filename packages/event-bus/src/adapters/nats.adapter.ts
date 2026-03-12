import type { EventBus } from '../event-bus'
import type { EventMap } from '../event-map'
import { type NatsConnection, StringCodec } from 'nats'

export class NatsEventBusAdapter<Events extends EventMap>
  implements EventBus<Events>
{
  private readonly sc = StringCodec()

  constructor(private readonly nc: NatsConnection) {}

  async emit<EventName extends keyof Events>(
    event: EventName,
    payload: Events[EventName]
  ): Promise<void> {
    const data = this.sc.encode(JSON.stringify(payload))
    this.nc.publish(String(event), data)
  }

  on<EventName extends keyof Events>(
    event: EventName,
    handler: (payload: Events[EventName]) => void | Promise<void>
  ): () => void {
    const sub = this.nc.subscribe(String(event))

    void (async () => {
      for await (const msg of sub) {
        const decoded = JSON.parse(
          this.sc.decode(msg.data)
        ) as Events[EventName]
        await handler(decoded)
      }
    })()

    return () => {
      sub.unsubscribe()
    }
  }
}
