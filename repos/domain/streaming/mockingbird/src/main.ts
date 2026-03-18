import { NestFactory } from '@nestjs/core'

import { requireNumberEnv } from '@env/lib'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = requireNumberEnv('PORT')

  await app.listen(port)
  console.log(`[Mockingbird] Listening on port ${port}`)
}

bootstrap()
