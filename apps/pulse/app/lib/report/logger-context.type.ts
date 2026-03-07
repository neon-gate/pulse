import { ErrorInfo } from 'react'

export interface LoggerContext {
  stack: ErrorInfo['componentStack']
}
