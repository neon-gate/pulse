import type { HttpError } from './http-error.type'

export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'status' in error &&
    'message' in error
  )
}
