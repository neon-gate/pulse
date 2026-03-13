import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import {
  logAxiomEvent,
  LogLevel,
  SoundgardenLogEvent
} from '@infra/axiom/observability'
import { requireNumberEnv } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    const port = requireNumberEnv('PORT')

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    )

    await app.listen(port)
  } catch (error) {
    await logAxiomEvent({
      event: SoundgardenLogEvent.ServiceStartupFailed,
      level: LogLevel.Error,
      context: {
        errorMessage:
          error instanceof Error ? error.message : 'unknown'
      }
    })
    process.exit(1)
  }
}

bootstrap()
