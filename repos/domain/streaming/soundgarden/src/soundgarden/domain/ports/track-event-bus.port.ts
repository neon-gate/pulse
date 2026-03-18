import { EventBus } from '@pack/kernel'

import type { TrackEventMap } from '@domain/events'

export abstract class TrackEventBusPort extends EventBus<TrackEventMap> {}
