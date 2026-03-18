import { Agent } from '@mastra/core/agent'

import { requireEnv } from '@shinoda/env'
import { analysePipelineTool } from '@shinoda/tools/analyse-pipeline'
import { inspectEventsTool } from '@shinoda/tools/inspect-events'
import { checkServicesTool } from '@shinoda/tools/check-services'
import { roleInstruction } from '@shinoda/knowledge/instructions/role.instruction'
import { platformArchitectureInstruction } from '@shinoda/knowledge/instructions/platform-architecture.instruction'
import { eventPipelineInstruction } from '@shinoda/knowledge/instructions/event-pipeline.instruction'
import { eventInventoryInstruction } from '@shinoda/knowledge/instructions/event-inventory.instruction'
import { dataSourcesInstruction } from '@shinoda/knowledge/instructions/data-sources.instruction'
import { diagnosticGuidelinesInstruction } from '@shinoda/knowledge/instructions/diagnostic-guidelines.instruction'
import { outputFormatInstruction } from '@shinoda/knowledge/instructions/output-format.instruction'

const instructions = [
  roleInstruction,
  platformArchitectureInstruction,
  eventPipelineInstruction,
  eventInventoryInstruction,
  dataSourcesInstruction,
  diagnosticGuidelinesInstruction,
  outputFormatInstruction
].join('\n\n')

export const shinodaAgent = new Agent({
  id: 'shinoda',
  name: 'shinoda',
  model: requireEnv('SHINODA_MODEL'),
  instructions,
  tools: {
    analysePipelineTool,
    inspectEventsTool,
    checkServicesTool
  }
})
