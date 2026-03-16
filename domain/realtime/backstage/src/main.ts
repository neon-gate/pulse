import { NestFactory } from '@nestjs/core'
import { IoAdapter } from '@nestjs/platform-socket.io'

import { requireNumberEnvCompute } from '@repo/environment'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new IoAdapter(app))
  const port = requireNumberEnvCompute('PORT')

  await app.listen(port)
  console.log(`[Backstage] Listening on port ${port}`)
}

bootstrap()
