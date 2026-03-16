import { NestFactory } from '@nestjs/core'

import { requireNumberEnvCompute } from '@repo/environment'
import { AppModule } from './shinod-ai.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(requireNumberEnvCompute('PORT'))
}

bootstrap().catch((error: unknown) => {
  console.error('[Shinod-AI] Startup failed:', error)
  process.exit(1)
})
