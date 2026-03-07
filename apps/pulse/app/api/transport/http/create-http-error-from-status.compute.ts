import { createHttpError } from './create-http-error.compute'
import { HTTP_ERROR_MAP } from './http-error.mapper'
import { HttpError } from './http-error.type'
import { HttpErrorName } from './http-error-name.enum'

export function createHttpErrorFromStatus(status: number): HttpError {
  const entry = Object.entries(HTTP_ERROR_MAP).find(
    ([, meta]) => meta.status === status
  )

  if (!entry) {
    return createHttpError(HttpErrorName.InternalServerError)
  }

  const [name, meta] = entry

  return {
    name: name as HttpErrorName,
    status: meta.status,
    message: meta.message,
    retryable: meta.retryable
  }
}
