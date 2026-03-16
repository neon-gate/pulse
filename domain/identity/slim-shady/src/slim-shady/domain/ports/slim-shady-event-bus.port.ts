import { EventBus } from '@repo/kernel'

import type { SlimShadyEventMap } from '@domain/events'

export abstract class SlimShadyEventBusPort extends EventBus<SlimShadyEventMap> {}
