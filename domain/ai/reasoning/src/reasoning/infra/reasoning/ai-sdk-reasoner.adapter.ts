import { Injectable } from '@nestjs/common'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'

import { CircuitBreaker } from '@repo/patterns'

import {
  ReasonerPort,
  type ReasoningContext,
  type ReasoningResult
} from '@domain/ports'
import { optionalStringEnv } from '@infra/env'

const ReasoningSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  reason: z.string()
})

const REASONING_TIMEOUT_MS = 30_000

/// Uses the Vercel AI SDK to reason about copyright and content policy.
/// Instrumental tracks (empty transcription) are treated as original content.
@Injectable()
export class AiSdkReasonerAdapter extends ReasonerPort {
  private readonly circuitBreaker = new CircuitBreaker({
    failureThreshold: 3,
    timeoutMs: REASONING_TIMEOUT_MS,
    resetTimeoutMs: 60_000
  })

  async reason(context: ReasoningContext): Promise<ReasoningResult> {
    const model = optionalStringEnv('AI_MODEL', 'gpt-4o-mini')
    const apiKey = optionalStringEnv('OPENAI_API_KEY', '')

    const openai = createOpenAI({ apiKey })

    const isInstrumental = context.transcriptionText.trim().length === 0

    const prompt = isInstrumental
      ? `A track (trackId: ${context.trackId}) has been uploaded. It appears to be instrumental (no lyrics detected). Fingerprint: ${context.fingerprintHash}. Please determine if it should be approved for the platform based on the available metadata. Respond with your decision and reason.`
      : `A track (trackId: ${context.trackId}) has been uploaded with the following lyrics (language: ${context.transcriptionLanguage}, duration: ${context.transcriptionDuration}s):

"${context.transcriptionText.slice(0, 2000)}"

Fingerprint: ${context.fingerprintHash}

Evaluate this track for:
1. Copyright issues (is this a known copyrighted song without proper licensing?)
2. Content policy (does it contain prohibited content?)

Approve if the track appears to be original or properly licensed. Reject if there are clear copyright or content violations.`

    const response = await this.circuitBreaker.execute(() =>
      generateObject({
        model: openai(model),
        schema: ReasoningSchema,
        prompt
      })
    )

    const result = ReasoningSchema.parse(response.object)
    return { decision: result.decision, reason: result.reason }
  }
}
