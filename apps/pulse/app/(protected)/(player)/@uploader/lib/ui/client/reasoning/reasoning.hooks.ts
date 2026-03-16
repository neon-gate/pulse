'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'

import { getOrCreateReasoningSocket } from './reasoning.connection'
import type { PipelineEventPayload, ReasoningMessage } from './reasoning.types'

const IDLE_TIMEOUT_MS = getIdleTimeoutFromEnv()

export interface UseReasoningSocketResult {
  messages: ReasoningMessage[]
  content: string
  isConnected: boolean
  isStreaming: boolean
  error: Error | null
}

export function useReasoningSocket(): UseReasoningSocketResult {
  const [messages, updateMessages] = useImmer<ReasoningMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleStreamingEnd = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    idleTimerRef.current = setTimeout(() => {
      setIsStreaming(false)
    }, IDLE_TIMEOUT_MS)
  }, [])

  const handleEvent = useCallback(
    (event: PipelineEventPayload) => {
      const message =
        typeof event.payload.message === 'string' && event.payload.message.length > 0
          ? event.payload.message
          : `Pipeline: ${event.event}`

      setIsStreaming(true)
      updateMessages((draft) => {
        draft.push({
          event: event.event,
          message,
          timestamp: event.timestamp,
          trackId: event.trackId
        })
      })
      scheduleStreamingEnd()
    },
    [scheduleStreamingEnd, updateMessages]
  )

  // Socket subscriptions require lifecycle setup/cleanup to avoid leaked listeners.
  useEffect(() => {
    const socket = getOrCreateReasoningSocket()

    function onConnect() {
      setIsConnected(true)
      setError(null)
    }

    function onDisconnect() {
      setIsConnected(false)
      setIsStreaming(false)
    }

    function onConnectError(err: Error) {
      setError(err)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('pipeline.event', handleEvent)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('pipeline.event', handleEvent)
    }
  }, [handleEvent])

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [])

  const content = messages
    .map((message) => message.message)
    .filter(Boolean)
    .join('\n\n')

  return { messages, content, isConnected, isStreaming, error }
}

function getIdleTimeoutFromEnv(): number {
  const value = process.env.NEXT_PUBLIC_REASONING_IDLE_TIMEOUT_MS

  if (!value) {
    throw new Error(
      'Missing required env var NEXT_PUBLIC_REASONING_IDLE_TIMEOUT_MS'
    )
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('NEXT_PUBLIC_REASONING_IDLE_TIMEOUT_MS must be a positive number')
  }

  return parsed
}
