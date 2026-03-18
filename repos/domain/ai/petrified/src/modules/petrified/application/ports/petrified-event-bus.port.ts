import { EventBus } from '@pack/event-bus'

import type { PetrifiedEventMap } from '@petrified/domain/events/petrified-event.map'

export abstract class PetrifiedEventBusPort extends EventBus<PetrifiedEventMap> {}
