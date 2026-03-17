import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { NatsConnection } from 'nats'
import { BroadcastPipelineEventUseCase } from '../../application/use-cases/broadcast-pipeline-event.use-case'
import { NatsConnectionToken } from '@repo/event-bus'
import { PIPELINE_EVENT_MESSAGES } from './pipeline-event-messages.data'

const MOCK_EVENT_SEQUENCE = [
  'track.upload.received',
  'track.upload.validated',
  'track.upload.stored',
  'track.uploaded',
  'track.petrified.generated',
  'track.petrified.song.unknown',
  'track.fort-minor.started',
  'track.fort-minor.completed',
  'track.stereo.started',
  'track.approved',
  'track.transcoding.started',
  'track.transcoding.completed',
  'track.hls.generated',
  'track.hls.stored'
]

const MOCK_DELAY_MS = 1200
const LOOP_PAUSE_MS = 5000

@Injectable()
export class MockEventGeneratorService implements OnModuleInit {
  constructor(
    private readonly broadcastUseCase: BroadcastPipelineEventUseCase,
    @Inject(NatsConnectionToken) private readonly nc: NatsConnection | null
  ) {}

  onModuleInit(): void {
    const mockMode = process.env.MOCK_MODE === 'true'
    if (this.nc && !mockMode) {
      console.log('[Backstage] NATS connected, skipping mock event generator')
      return
    }

    void this.runMockSequence()
  }

  private async runMockSequence(): Promise<void> {
    while (true) {
      const trackId = crypto.randomUUID()

      for (const eventType of MOCK_EVENT_SEQUENCE) {
        await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))

        await this.broadcastUseCase.execute({
          trackId,
          eventType,
          payload: {
            message: PIPELINE_EVENT_MESSAGES[eventType] ?? eventType
          }
        })

        console.log('[Backstage] Mock event:', eventType, trackId)
      }

      await new Promise((r) => setTimeout(r, LOOP_PAUSE_MS))
    }
  }
}
