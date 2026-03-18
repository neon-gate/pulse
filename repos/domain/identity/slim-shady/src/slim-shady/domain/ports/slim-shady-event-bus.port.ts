import { EventBus } from '@pack/kernel'

import type { SlimShadyEventMap } from '@domain/events'

export abstract class SlimShadyEventBusPort extends EventBus<SlimShadyEventMap> {}
