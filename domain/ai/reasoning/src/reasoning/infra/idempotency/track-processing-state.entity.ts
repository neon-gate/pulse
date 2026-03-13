import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('track_processing_state')
export class TrackProcessingStateEntity {
  @PrimaryColumn() trackId!: string
  @Column({ default: false }) fingerprintReady!: boolean
  @Column({ nullable: true, type: 'varchar' }) fingerprintHash!: string | null
  @Column({ nullable: true, type: 'varchar' }) audioHash!: string | null
  @Column({ default: false }) transcriptionReady!: boolean
  @Column({ nullable: true, type: 'text' }) transcriptionText!: string | null
  @Column({ nullable: true, type: 'varchar' }) transcriptionLanguage!: string | null
  @Column({ nullable: true, type: 'float' }) transcriptionDuration!: number | null
  @Column({ default: false }) reasoningStarted!: boolean
  @Column({ default: () => 'NOW()' }) createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
