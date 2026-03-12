import { IsString } from 'class-validator'

export class StartResponseDto {
  @IsString()
  trackId!: string

  @IsString()
  playlistPath!: string
}
