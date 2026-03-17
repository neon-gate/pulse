import { EventBus } from '@repo/kernel'

import type { TrackEventMap } from '@domain/events'

export abstract class TrackEventBusPort extends EventBus<TrackEventMap> {}
