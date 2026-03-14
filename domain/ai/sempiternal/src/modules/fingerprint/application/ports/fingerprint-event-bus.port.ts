import { EventBus } from '@repo/kernel'

import type { FingerprintEventMap } from '@fingerprint/domain/events/fingerprint-event.map'

export abstract class FingerprintEventBusPort extends EventBus<FingerprintEventMap> {}
