import { NestFactory } from '@nestjs/core'
import { logAxiomEvent, LogLevel, TranscriptionLogEvent } from '@infra/axiom/observability'
import { requireNumberEnv } from '@infra/env'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    await app.listen(requireNumberEnv('PORT'))
  } catch (error) {
    await logAxiomEvent({
      event: TranscriptionLogEvent.ServiceStartupFailed,
      level: LogLevel.Error,
      context: { errorMessage: error instanceof Error ? error.message : 'unknown' }
    })
    process.exit(1)
  }
}

bootstrap()
