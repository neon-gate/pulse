import { IsOptional, IsUUID } from 'class-validator'

export class StartRequestDto {
  @IsUUID()
  @IsOptional()
  trackId?: string
}
