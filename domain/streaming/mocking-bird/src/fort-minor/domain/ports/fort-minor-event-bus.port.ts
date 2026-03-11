import type { EventBus } from '@repo/event-bus'

import type { FortMinorEventMap } from '@domain/events'

export const FortMinorEventBusPort = Symbol('FortMinorEventBusPort')

export type FortMinorEventBus = EventBus<FortMinorEventMap>
