import { HttpErrorName } from './http-error-name.enum'

export interface HttpError {
  name: HttpErrorName
  status: number
  message: string
  retryable: boolean
}
