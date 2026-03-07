import {
  createHttpError,
  createHttpErrorFromStatus,
  HttpErrorName
} from '@api/transport/http'
import axios, { AxiosError } from 'axios'

export function loginErrorResponseInterceptor(error: AxiosError) {
  if (axios.isAxiosError(error)) {
    // Server responded with a status code
    if (error.response) {
      const httpError = createHttpErrorFromStatus(error.response.status)
      const withData = {
        ...httpError,
        responseData: error.response.data
      }
      return Promise.reject(withData)
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(createHttpError(HttpErrorName.RequestTimeout))
    }

    // Network failure
    return Promise.reject(createHttpError(HttpErrorName.ServiceUnavailable))
  }

  // Unknown unexpected error
  return Promise.reject(createHttpError(HttpErrorName.InternalServerError))
}
