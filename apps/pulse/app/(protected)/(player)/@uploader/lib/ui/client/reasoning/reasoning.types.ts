export interface PipelineEventPayload {
  type: 'pipeline.event'
  event: string
  trackId: string
  timestamp: string
  payload: {
    message?: string
    [key: string]: unknown
  }
}

export interface ReasoningMessage {
  event: string
  message: string
  timestamp: string
  trackId: string
}
