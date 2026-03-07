import { HttpError } from './http-error.type'
import { HttpErrorName } from './http-error-name.enum'

export const HTTP_ERROR_MAP: Record<HttpErrorName, Omit<HttpError, 'name'>> = {
  [HttpErrorName.BadRequest]: {
    status: 400,
    message: 'Bad request',
    retryable: false
  },
  [HttpErrorName.ValidationError]: {
    status: 400,
    message: 'Validation error',
    retryable: false
  },
  [HttpErrorName.Unauthorized]: {
    status: 401,
    message: 'Unauthorized',
    retryable: false
  },
  [HttpErrorName.Forbidden]: {
    status: 403,
    message: 'Forbidden',
    retryable: false
  },
  [HttpErrorName.NotFound]: {
    status: 404,
    message: 'Resource not found',
    retryable: false
  },
  [HttpErrorName.RequestTimeout]: {
    status: 408,
    message: 'Request timeout',
    retryable: true
  },
  [HttpErrorName.TooManyRequests]: {
    status: 429,
    message: 'Too many requests',
    retryable: true
  },
  [HttpErrorName.InternalServerError]: {
    status: 500,
    message: 'Internal server error',
    retryable: true
  },
  [HttpErrorName.BadGateway]: {
    status: 502,
    message: 'Bad gateway',
    retryable: true
  },
  [HttpErrorName.ServiceUnavailable]: {
    status: 503,
    message: 'Service unavailable',
    retryable: true
  },
  [HttpErrorName.GatewayTimeout]: {
    status: 504,
    message: 'Gateway timeout',
    retryable: true
  }
}
