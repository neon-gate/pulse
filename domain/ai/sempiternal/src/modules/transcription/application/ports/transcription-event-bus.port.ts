import { EventBus } from '@repo/kernel'

import type { TranscriptionEventMap } from '@transcription/domain/events/transcription-event.map'

export abstract class TranscriptionEventBusPort extends EventBus<TranscriptionEventMap> {}
