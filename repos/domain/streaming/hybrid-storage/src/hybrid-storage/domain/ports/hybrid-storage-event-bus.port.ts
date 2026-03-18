import { EventBus } from '@pack/kernel'

import type { HybridStorageEventMap } from '@domain/events'

export abstract class HybridStorageEventBusPort extends EventBus<HybridStorageEventMap> {}
