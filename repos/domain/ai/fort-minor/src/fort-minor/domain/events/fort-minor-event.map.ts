import type { EventMap } from '@pack/kernel'
import { TrackEvent } from '@env/event-inventory'

export class PetrifiedGeneratedEventMap implements EventMap {
  [TrackEvent.PetrifiedGenerated]: {
    trackId: string
    fingerprintHash: string
    audioHash: string
    storage: { bucket: string; key: string }
    generatedAt: string
  }
}

/// Events emitted by the fort-minor module (outbound).
export interface FortMinorEventMap extends EventMap {
  [TrackEvent.FortMinorStarted]: {
    trackId: string
    startedAt: string
  }
  [TrackEvent.FortMinorCompleted]: {
    trackId: string
    language: string
    text: string
    segments: Array<{ start: number; end: number; text: string }>
    durationInSeconds: number
    completedAt: string
  }
  [TrackEvent.FortMinorFailed]: {
    trackId: string
    errorCode: string
    message: string
  }
}
