'use client'

import type { ReactNode } from 'react'

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger
} from '@shadcn/components/ai-elements/reasoning'
import { Shimmer } from '@shadcn/components/ai-elements/shimmer'

import { getThinkingLabel } from './reasoning.compute'
import { useReasoningSocket } from './reasoning.hooks'

export function ReasoningPipeline() {
  const { content, isConnected, isStreaming, error } = useReasoningSocket()

  function getThinkingMessage(
    streaming: boolean,
    duration?: number
  ): ReactNode {
    const label = getThinkingLabel(isConnected, streaming, duration)
    return <Shimmer duration={1}>{label}</Shimmer>
  }

  return (
    <div className="w-full p-4 h-full">
      <Reasoning className="w-full" isStreaming={isStreaming}>
        <ReasoningTrigger getThinkingMessage={getThinkingMessage} />
        <ReasoningContent>
          {error ? `Connection error: ${error.message}` : content || ''}
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}
