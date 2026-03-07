import { z } from 'zod'

import type { FieldErrors } from './field-errors.type'

type ZodObjectSchema = z.ZodObject<z.ZodRawShape>

export function getFieldErrors<Schema extends ZodObjectSchema>(
  input: unknown,
  schema: Schema
): FieldErrors<Schema> | null {
  const parseResult = schema.safeParse(input)

  if (parseResult.success) return null

  return parseResult.error.flatten().fieldErrors
}
