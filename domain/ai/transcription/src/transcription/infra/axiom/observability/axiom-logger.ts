import { LogLevel } from './log-level.enum'

interface LogEvent { event: string; level: LogLevel; context?: Record<string, unknown> }

export async function logAxiomEvent(event: LogEvent): Promise<void> {
  const dataset = process.env.AXIOM_DATASET
  const apiToken = process.env.AXIOM_API_TOKEN
  const baseUrl = (process.env.AXIOM_BASE_URL ?? 'https://api.axiom.co/v1/datasets').replace(/\/+$/, '')
  if (!dataset || !apiToken) return
  try {
    await fetch(`${baseUrl}/${dataset}/ingest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ timestamp: new Date().toISOString(), service: 'api-transcription', ...event }])
    })
  } catch { /* resilient */ }
}
