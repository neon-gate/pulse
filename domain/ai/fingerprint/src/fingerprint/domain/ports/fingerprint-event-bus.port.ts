import { EventBus } from '@repo/kernel'

import type { FingerprintEventMap } from '@domain/events'

export abstract class FingerprintEventBusPort extends EventBus<FingerprintEventMap> {}
