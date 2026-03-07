import { LoggerContext } from './logger-context.type'

export interface Logger {
  log: (message: string, context: LoggerContext) => void
}
