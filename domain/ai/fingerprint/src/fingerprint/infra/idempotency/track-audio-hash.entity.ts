import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('track_audio_hashes')
export class TrackAudioHashEntity {
  @PrimaryColumn()
  trackId!: string

  @Column()
  @Index({ unique: true })
  audioHash!: string

  @Column({ default: () => 'NOW()' })
  createdAt!: Date
}
