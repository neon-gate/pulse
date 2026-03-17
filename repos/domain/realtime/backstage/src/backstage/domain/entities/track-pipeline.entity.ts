import { Entity, UniqueEntityId } from '@repo/kernel'

import { PipelineEvent } from './pipeline-event.value-object'

export interface TrackPipelineProps {
  trackId: string
  status: 'processing' | 'ready' | 'failed'
  currentStage: string
  events: PipelineEvent[]
  createdAt: Date
  updatedAt: Date
}

export class TrackPipeline extends Entity<TrackPipelineProps> {
  private constructor(props: TrackPipelineProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    trackId: string,
    event: PipelineEvent,
    id?: UniqueEntityId
  ): TrackPipeline {
    const now = new Date()
    return new TrackPipeline(
      {
        trackId,
        status: 'processing',
        currentStage: event.eventType,
        events: [event],
        createdAt: now,
        updatedAt: now
      },
      id ?? UniqueEntityId.create(trackId)
    )
  }

  static reconstitute(props: TrackPipelineProps, id: UniqueEntityId): TrackPipeline {
    return new TrackPipeline(props, id)
  }

  get trackId(): string {
    return this.props.trackId
  }

  get status(): TrackPipelineProps['status'] {
    return this.props.status
  }

  get currentStage(): string {
    return this.props.currentStage
  }

  get events(): PipelineEvent[] {
    return [...this.props.events]
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  appendEvent(event: PipelineEvent): void {
    this.props.events.push(event)
    this.props.currentStage = event.eventType
    this.props.updatedAt = new Date()

    if (event.eventType === 'track.hls.stored') {
      this.props.status = 'ready'
    } else if (
      event.eventType === 'track.upload.failed' ||
      event.eventType === 'track.rejected' ||
      event.eventType === 'track.petrified.failed' ||
      event.eventType === 'track.fort-minor.failed' ||
      event.eventType === 'track.stereo.failed' ||
      event.eventType === 'track.transcoding.failed'
    ) {
      this.props.status = 'failed'
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.toString(),
      trackId: this.props.trackId,
      status: this.props.status,
      currentStage: this.props.currentStage,
      events: this.props.events.map((e) => e.toJSON()),
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString()
    }
  }
}
