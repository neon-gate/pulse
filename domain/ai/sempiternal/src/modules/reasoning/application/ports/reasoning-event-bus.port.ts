import { EventBus } from '@repo/kernel'

import type { ReasoningEventMap } from '@reasoning/domain/events/reasoning-event.map'

export abstract class ReasoningEventBusPort extends EventBus<ReasoningEventMap> {}
