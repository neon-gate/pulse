import { EventBus } from '@repo/kernel'
import type { ReasoningEventMap } from '@domain/events'

export abstract class ReasoningEventBusPort extends EventBus<ReasoningEventMap> {}
