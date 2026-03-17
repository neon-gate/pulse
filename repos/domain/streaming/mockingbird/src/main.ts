import { NestFactory } from '@nestjs/core'

import { requireNumberEnvCompute } from '@repo/environment'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = requireNumberEnvCompute('PORT')

  await app.listen(port)
  console.log(`[Mockingbird] Listening on port ${port}`)
}

bootstrap()
