import { EventBus } from '@pack/event-bus'

import type { SlimShadyEventMap } from '@domain/events'

export abstract class SlimShadyEventBusPort extends EventBus<SlimShadyEventMap> {}
