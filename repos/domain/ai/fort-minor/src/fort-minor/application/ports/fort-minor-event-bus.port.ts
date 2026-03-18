import { EventBus } from '@pack/event-bus'

import type { FortMinorEventMap } from '@domain/events/fort-minor-event.map'

export abstract class FortMinorEventBusPort extends EventBus<FortMinorEventMap> {}
