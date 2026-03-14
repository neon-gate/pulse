import { NestFactory } from '@nestjs/core'

import { requireNumberEnv } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(requireNumberEnv('PORT'))
}

bootstrap()
