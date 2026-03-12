import { Injectable, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

import type { GoogleAuthRequestDto } from '@interface/dto'
import { parseWithSchema } from '@interface/http/pipes/zod-validation'

const googleAuthSchema = z
  .object({
    idToken: z.string().min(1, 'Google ID token is required')
  })
  .strict()

@Injectable()
export class GoogleAuthBodyPipe
  implements PipeTransform<unknown, GoogleAuthRequestDto>
{
  transform(value: unknown): GoogleAuthRequestDto {
    return parseWithSchema(googleAuthSchema, value)
  }
}
