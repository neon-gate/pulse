import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('processed_events_transcription')
export class ProcessedEventEntity {
  @PrimaryColumn() eventId!: string
  @Column({ default: () => 'NOW()' }) processedAt!: Date
}
