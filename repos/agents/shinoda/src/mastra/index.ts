import { Mastra } from '@mastra/core'

import { shinodaAgent } from '@shinoda/shinoda.agent'
import { debugPipelineWorkflow } from '@shinoda/workflows/debug-pipeline.workflow'
import { signalBus } from '@shinoda/signals/signal-bus'

signalBus.on('TRACK_STUCK', (payload) => {
  console.log(
    `[shinoda:signal] TRACK_STUCK — track=${payload.trackId} stage=${payload.lastStage} stuck=${payload.stuckSinceMs}ms`
  )
})

signalBus.on('SERVICE_UNHEALTHY', (payload) => {
  console.log(
    `[shinoda:signal] SERVICE_UNHEALTHY — service=${payload.service} url=${payload.url} error=${payload.error}`
  )
})

signalBus.on('PIPELINE_ANOMALY', (payload) => {
  console.log(
    `[shinoda:signal] PIPELINE_ANOMALY — track=${payload.trackId} type=${payload.anomalyType} ${payload.description}`
  )
})

signalBus.on('DIAGNOSIS_READY', (payload) => {
  console.log(
    `[shinoda:signal] DIAGNOSIS_READY — track=${payload.trackId} status=${payload.diagnosis.status} ${payload.diagnosis.summary}`
  )
})

export const mastra = new Mastra({
  agents: {
    shinoda: shinodaAgent
  },
  workflows: {
    'debug-pipeline': debugPipelineWorkflow
  }
})
