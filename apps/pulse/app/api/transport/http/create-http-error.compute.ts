import { HTTP_ERROR_MAP } from './http-error.mapper'
import { HttpError } from './http-error.type'
import { HttpErrorName } from './http-error-name.enum'

export function createHttpError(name: HttpErrorName): HttpError {
  const meta = HTTP_ERROR_MAP[name]

  return {
    name,
    status: meta.status,
    message: meta.message,
    retryable: meta.retryable
  }
}
