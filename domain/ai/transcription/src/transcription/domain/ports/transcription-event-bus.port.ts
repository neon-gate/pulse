import { EventBus } from '@repo/kernel'
import type { TranscriptionEventMap } from '@domain/events'

export abstract class TranscriptionEventBusPort extends EventBus<TranscriptionEventMap> {}
