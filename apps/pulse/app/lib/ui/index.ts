/* =================
  Server components
================== */
export { Header } from './server/header/header'
export { Main } from './server/main/main'

/* ================
  Client components
================== */
export { Logo } from './client/logo/logo'

/* =================
  Validation
================== */
export { getFieldErrors } from './validation/get-field-errors.compute'
export type { FieldErrors, SchemaState, ZodObjectSchema } from './validation/validation.types'