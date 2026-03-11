import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { requireNumberEnv } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.enableCors({ origin: true })
  app.enableShutdownHooks()

  const port = requireNumberEnv('PORT')

  await app.listen(port)
}

void bootstrap()
