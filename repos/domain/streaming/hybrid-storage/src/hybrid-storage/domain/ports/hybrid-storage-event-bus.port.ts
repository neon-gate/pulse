import { EventBus } from '@pack/event-bus'

import type { HybridStorageEventMap } from '@domain/events'

export abstract class HybridStorageEventBusPort extends EventBus<HybridStorageEventMap> {}
