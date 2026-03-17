export interface TrackStuckPayload {
  trackId: string
  lastStage: string
  expectedNextStage: string
  stuckSinceMs: number
  timestamp: string
}

export interface ServiceUnhealthyPayload {
  service: string
  url: string
  error: string
  timestamp: string
}

export interface PipelineAnomalyPayload {
  trackId: string
  anomalyType: 'gap' | 'out_of_order' | 'duplicate_event' | 'timeout'
  description: string
  timestamp: string
}

export interface DiagnosisReadyPayload {
  trackId: string
  diagnosis: {
    currentStage: string
    status: string
    summary: string
    suggestedAction: string
  }
  timestamp: string
}

export interface ShinodaEventMap {
  TRACK_STUCK: TrackStuckPayload
  SERVICE_UNHEALTHY: ServiceUnhealthyPayload
  PIPELINE_ANOMALY: PipelineAnomalyPayload
  DIAGNOSIS_READY: DiagnosisReadyPayload
}

export type ShinodaEventName = keyof ShinodaEventMap
