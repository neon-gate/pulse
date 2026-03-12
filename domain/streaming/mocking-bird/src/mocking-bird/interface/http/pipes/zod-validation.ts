import { BadRequestException } from '@nestjs/common'
import type { ZodSchema } from 'zod'

export function parseWithSchema<T>(schema: ZodSchema<T>, value: unknown): T {
  const parsed = schema.safeParse(value)

  if (!parsed.success) {
    const flattened = parsed.error.flatten()
    throw new BadRequestException({
      message: 'Invalid request',
      errors: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors
      }
    })
  }

  return parsed.data
}
