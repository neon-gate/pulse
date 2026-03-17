import { EventBus } from '@repo/kernel'

import type { PetrifiedEventMap } from '@petrified/domain/events/petrified-event.map'

export abstract class PetrifiedEventBusPort extends EventBus<PetrifiedEventMap> {}
