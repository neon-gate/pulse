import { Injectable, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

import type { StartRequestDto } from '@interface/dto'
import { parseWithSchema } from '@interface/http/pipes/zod-validation'

const startSchema = z
  .object({
    trackId: z.string().uuid().optional()
  })
  .strict()

@Injectable()
export class StartBodyPipe implements PipeTransform<unknown, StartRequestDto> {
  transform(value: unknown): StartRequestDto {
    return parseWithSchema(startSchema, value)
  }
}
