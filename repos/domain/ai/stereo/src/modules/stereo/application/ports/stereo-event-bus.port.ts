import { EventBus } from '@pack/event-bus'

import type { StereoEventMap } from '@stereo/domain/events/stereo-event.map'

export abstract class StereoEventBusPort extends EventBus<StereoEventMap> {}
