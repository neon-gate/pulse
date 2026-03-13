import { NestFactory } from '@nestjs/core'

import {
  logAxiomEvent,
  LogLevel,
  FingerprintLogEvent
} from '@infra/axiom/observability'
import { requireNumberEnv } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    const port = requireNumberEnv('PORT')
    await app.listen(port)
  } catch (error) {
    await logAxiomEvent({
      event: FingerprintLogEvent.ServiceStartupFailed,
      level: LogLevel.Error,
      context: {
        errorMessage: error instanceof Error ? error.message : 'unknown'
      }
    })
    process.exit(1)
  }
}

bootstrap()
