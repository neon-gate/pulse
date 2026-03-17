import { EventBus } from '@repo/kernel'

import type { HybridStorageEventMap } from '@domain/events'

export abstract class HybridStorageEventBusPort extends EventBus<HybridStorageEventMap> {}
