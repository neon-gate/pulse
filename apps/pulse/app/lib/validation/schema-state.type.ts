import type { HttpError } from '@api/transport/http'
import type { FieldErrors, ZodObjectSchema } from './field-errors.type'

export interface SchemaState<Schema extends ZodObjectSchema> {
  apiError: HttpError | null
  fieldErrors: FieldErrors<Schema>
  isPending: boolean
}
