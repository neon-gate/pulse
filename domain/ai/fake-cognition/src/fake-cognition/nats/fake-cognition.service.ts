import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common'
import {
  connect,
  StringCodec,
  type NatsConnection,
  type Subscription
} from 'nats'

const sc = StringCodec()
const STEP_DELAY_MS = 1_000

type ReasoningStep = 'waveform_analysis' | 'fingerprint_generation' | 'song_detection'

const STEPS: ReasoningStep[] = [
  'waveform_analysis',
  'fingerprint_generation',
  'song_detection'
]

/// Simulates the AI cognition pipeline by emitting a deterministic sequence
/// of reasoning events for each uploaded track.
///
/// This service validates the event-driven architecture without requiring
/// real AI inference.
@Injectable()
export class FakeCognitionService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private connection: NatsConnection | null = null
  private subscription: Subscription | null = null

  async onApplicationBootstrap(): Promise<void> {
    const servers = process.env.NATS_URL
    if (!servers) {
      console.warn('[FakeCognition] NATS_URL not set — running in no-op mode')
      return
    }

    try {
      this.connection = await connect({ servers })
      console.log('[FakeCognition] Connected to NATS')

      this.subscription = this.connection.subscribe('track.uploaded')
      console.log('[FakeCognition] Subscribed to track.uploaded')

      void this.consumeLoop()
    } catch (error) {
      console.error('[FakeCognition] Failed to connect to NATS:', error)
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.subscription?.unsubscribe()
    if (this.connection) await this.connection.drain()
  }

  private async consumeLoop(): Promise<void> {
    if (!this.subscription) return

    for await (const msg of this.subscription) {
      try {
        const payload = JSON.parse(sc.decode(msg.data)) as { trackId: string }
        const { trackId } = payload
        console.log(`[FakeCognition] Processing trackId=${trackId}`)
        void this.simulateReasoning(trackId)
      } catch {
        // Malformed message — skip.
      }
    }
  }

  private async simulateReasoning(trackId: string): Promise<void> {
    if (!this.connection) return

    await this.publish('track.reasoning.started', {
      trackId,
      stage: 'audio-analysis',
      startedAt: new Date().toISOString()
    })

    for (const step of STEPS) {
      await this.delay(STEP_DELAY_MS)
      await this.publish('track.reasoning.step', {
        trackId,
        step,
        timestamp: new Date().toISOString()
      })
    }

    await this.delay(STEP_DELAY_MS)
    await this.publish('track.reasoning.completed', {
      trackId,
      result: 'song_detected',
      confidence: 0.92,
      completedAt: new Date().toISOString()
    })

    console.log(`[FakeCognition] Completed reasoning for trackId=${trackId}`)
  }

  private publish(subject: string, payload: unknown): Promise<void> {
    if (!this.connection) return Promise.resolve()
    const data = sc.encode(JSON.stringify(payload))
    this.connection.publish(subject, data)
    console.log(`[FakeCognition] Emitted ${subject}`)
    return Promise.resolve()
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
