import { EventBus } from '@pack/event-bus'

import type { TrackEventMap } from '@domain/events'

export abstract class TrackEventBusPort extends EventBus<TrackEventMap> {}
