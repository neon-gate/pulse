import { z } from 'zod'

export type ZodObjectSchema = z.ZodObject<z.ZodRawShape>

export type FieldErrors<Schema extends ZodObjectSchema> = z.ZodFlattenedError<
  z.output<Schema>
>['fieldErrors']
