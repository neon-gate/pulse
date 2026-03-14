export type ReasoningDecision = 'approved' | 'rejected'

export interface ReasoningContext {
  trackId: string
  fingerprintHash: string
  audioHash: string
  transcriptionText: string
  transcriptionLanguage: string
  transcriptionDuration: number
}

export interface ReasoningResult {
  decision: ReasoningDecision
  reason: string
}

/// Port for AI-based copyright and content policy reasoning.
export abstract class ReasonerPort {
  abstract reason(context: ReasoningContext): Promise<ReasoningResult>
}
