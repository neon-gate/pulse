import { EventBus } from '@pack/kernel'

import type { StereoEventMap } from '@stereo/domain/events/stereo-event.map'

export abstract class StereoEventBusPort extends EventBus<StereoEventMap> {}
