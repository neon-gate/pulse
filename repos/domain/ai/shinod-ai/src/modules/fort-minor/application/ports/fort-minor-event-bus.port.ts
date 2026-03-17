import { EventBus } from '@repo/kernel'

import type { FortMinorEventMap } from '@fort-minor/domain/events/fort-minor-event.map'

export abstract class FortMinorEventBusPort extends EventBus<FortMinorEventMap> {}
