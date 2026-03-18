import type { EventBus, EventMap } from '@pack/kernel'

export class NoopEventBusAdapter<Events extends EventMap>
  implements EventBus<Events>
{
  async emit(): Promise<void> {
    // no-op
  }

  on(): () => void {
    return () => {}
  }
}
